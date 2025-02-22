import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from '../common';
import { IsNull, Repository } from 'typeorm';
import { TodoList, User } from 'src/database/models';
import { CreateTodoDto } from 'src/dtos/todo.dto';


@Injectable()
export class TodoListService {
    constructor(
        @InjectRepository(TodoList)
        private todoListRepository: Repository<TodoList>,
        private readonly responseService: ResponseService,
    ) { }

    async create(data: CreateTodoDto, user: User): Promise<Partial<TodoList>> {
        try {
            const todoList = this.todoListRepository.create({ ...data, user });

            const result = await this.todoListRepository.save(todoList);

            const { deletedAt, user: _, ...response } = result;

            return response;
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async findAll(user: User): Promise<TodoList[]> {
        try {
            return this.todoListRepository.find({ where: { user: { id: user.id }, deletedAt: IsNull() } });

        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async findOne(id: number, user: User): Promise<TodoList | null> {
        try {
            const todo = await this.todoListRepository.findOne({ where: { id, user: { id: user.id }, deletedAt: IsNull() } });
            if (!todo) {
                throw this.responseService.generateErrorResponse('No Todo List found', 404);
            }

            return todo;
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async update(id: number, body: CreateTodoDto, user: User): Promise<TodoList | undefined> {
        try {
            const todoList = await this.todoListRepository.findOne({ where: { id, user: { id: user.id }, deletedAt: IsNull() } });
            if (!todoList) {
                throw this.responseService.generateErrorResponse('No Todo List found', 404);
            }

            todoList.name = body.name;
            return this.todoListRepository.save(todoList);
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async delete(id: number, user: User): Promise<void> {
        try {
            const todo = await this.todoListRepository.softDelete({ id, user: { id: user.id }, deletedAt: IsNull() });

            if (!todo?.affected) {
                throw this.responseService.generateErrorResponse('No Todo List found', 404);
            }

        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }
};
