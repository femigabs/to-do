import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { DatabaseModule } from '../database';
import { ResponseService } from '../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList, User } from '../database/models';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, TodoList]),
    
  ],
  providers: [TodoListService, ResponseService],
  exports: [TodoListService, ResponseService],
})
export class TodoListModule {}