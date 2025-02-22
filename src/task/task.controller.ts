import {
  Controller,
  Post,
  Body,
  HttpException,
  Get,
  Param,
  Delete,
  Put,
  Req,
  HttpCode
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JoiValidationPipe, ResponseService } from '../common';
import { createTaskSchema, updateTaskSchema } from './create.task.valiadations';
import { CreateTaskDto, UpdateTaskDto } from 'src/dtos/task.dto';

@Controller('todo-list')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly responseService: ResponseService,
  ) { }

  @Post('/:todo_id/task')
  @HttpCode(201)
  async create(@Param('todo_id') id: number, @Body(new JoiValidationPipe(createTaskSchema)) body: CreateTaskDto, @Req() req) {
    const user = req.user;
    try {

      const todo = await this.taskService.create(body, user, id);

      return this.responseService.generateSuccessResponse(
        todo,
        'Task created successfully',
        201,
      );
    } catch (error) {
      const message = error.message || 'Error creating task';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }

  @Get('/:todo_id/task')
  async findAll(@Req() req) {
    const user = req.user;
    try {
      const todo = await this.taskService.findAll(user);

      return this.responseService.generateSuccessResponse(
        todo,
        'Todo lists fetched successfully',
        200,
      );
    } catch (error) {
      const message = error.message || 'Error fetching todo lists';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }

  @Get('/:id/task/:id')
  async findOne(@Param('id') id: number, @Req() req) {
    const user = req.user;
    try {
      const todo = await this.taskService.findOne(id, user);

      return this.responseService.generateSuccessResponse(
        todo,
        'Todo list fetched successfully',
        200,
      );
    } catch (error) {
      const message = error.message || 'Error fetching todo list';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }

  @Put('task/:id')
  async update(@Param('id') id: number, @Body(new JoiValidationPipe(updateTaskSchema)) body: UpdateTaskDto, @Req() req) {
    const user = req.user;
    try {
      const todo = await this.taskService.update(id, body, user);

      return this.responseService.generateSuccessResponse(
        todo,
        'Todo list updated successfully',
        200,
      );
    } catch (error) {
      const message = error.message || 'Error updated todo list';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    const user = req.user;
    try {
      const todo = await this.taskService.delete(id, user);

      return this.responseService.generateSuccessResponse(
        todo,
        'Todo list deleted successfully',
        200,
      );
    } catch (error) {
      const message = error.message || 'Error deleted todo list';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }
}
