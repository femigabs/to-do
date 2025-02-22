import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from '../common';
import { IsNull, Repository } from 'typeorm';
import { Task as TaskEntity, User, TodoList } from 'src/database/models';
import { CreateTaskDto, UpdateTaskDto } from 'src/dtos/task.dto';

interface Task extends TaskEntity {
    timelineStatus?: string;
}

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private taskRepository: Repository<Task>,
        private readonly responseService: ResponseService,
    ) { }

    async create(body: CreateTaskDto, user: User, todoList: number): Promise<Partial<Task>> {
        try {
            const task = this.taskRepository.create({ ...body, todoList: { id: todoList } });

            const result = await this.taskRepository.save(task);

            const { todoList: _, todoListId, deletedAt, ...data } = result;

            return data;

        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }

    }

    private getTimelineStatus(dueDate: Date): string {
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - dueDate.getTime()) / 36e5;

        if (diffInHours > 72) return 'green';
        if (diffInHours < 24) return 'amber';
        if (diffInHours < 3) return 'red';

        return 'green';
    }

    async findAll(todoListId: number): Promise<Task[]> {
        try {
            return this.taskRepository.find({
                where: { todoList: { id: todoListId }, deletedAt: IsNull() },
            });
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }

    }

    async findOne(id: number, todoListId: number): Promise<Task | null> {
        try {
            const task = await this.taskRepository.findOne({
                where: { id, todoList: { id: todoListId }, deletedAt: IsNull() },
            });

            if (!task) return null;

            return {
                ...task,
                timelineStatus: this.getTimelineStatus(task.dueDate),
            };
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async update(id: number, body: UpdateTaskDto, todoListId: number): Promise<Task | null> {
        try {
            const task = await this.taskRepository.findOne({
                where: { id, todoList: { id: todoListId }, deletedAt: IsNull() },
            });
            if (!task) return null;

            task.status = body.status;
            return this.taskRepository.save(task);
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async delete(id: number, todoListId: number): Promise<void> {
        try {
            await this.taskRepository.softDelete({ id, todoList: { id: todoListId } });
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

};
