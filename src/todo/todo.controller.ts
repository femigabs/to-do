import {
  Controller,
  Post,
  Body,
  HttpException,

  UseFilters,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { JoiValidationPipe, ResponseService } from '../common';
import { createTodoListSchema } from './create.todo-list.valiadations';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { CreateTodoDto } from 'src/dtos/todo.dto';

@Controller('todo-list')
export class TodoListController {
  constructor(
    private readonly todoListService: TodoListService,
    private readonly responseService: ResponseService,
  ) { }

  @Post()
  @HttpCode(201)
  async create(@Body(new JoiValidationPipe(createTodoListSchema)) body: CreateTodoDto, @Req() req) {
    const user = req.user;
    try {

      const todo = await this.todoListService.create(body, user);

      return this.responseService.generateSuccessResponse(
        todo,
        'Todo list created successfully',
        201,
      );
    } catch (error) {
      const message = error.message || 'Error creating todo list';

      throw new HttpException(message, error?.statusCode || 400);
    }
  }

  @Get()
  async findAll(@Req() req) {
    const user = req.user;
    try {
      const todo = await this.todoListService.findAll(user);

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

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const user = req.user;
    try {
      const todo = await this.todoListService.findOne(id, user);

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

  @Put(':id')
  async update(@Param('id') id: number, @Body(new JoiValidationPipe(createTodoListSchema)) body: CreateTodoDto, @Req() req) {
    const user = req.user;
    try {
      const todo = await this.todoListService.update(id, body, user);

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
      const todo = await this.todoListService.delete(id, user);

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
