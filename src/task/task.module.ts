import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { DatabaseModule } from '../database';
import { ResponseService } from '../common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList, User } from '../database/models';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, TodoList]),
    
  ],
  providers: [TaskService, ResponseService],
  exports: [TaskService, ResponseService],
})
export class TodoListModule {}