import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ConfigAppModule } from './config';
import { DatabaseModule } from './database';
import { ResponseService, HttpExceptionFilter } from './common';
import { CustomLoggerService } from './config';
import { Task, TodoList, User } from './database/models';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { TodoListModule } from './todo/todo-list.module';
import { TodoListController } from './todo/todo.controller';
import { TodoListService } from './todo/todo-list.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';


@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, TodoList, Task]),
    ConfigAppModule,
    AuthModule,
    TodoListModule,
    Task
  ],
  controllers: [
    AppController, 
    AuthController,
    TodoListController,
    TaskController
  ],
  providers: [
    AppService,
    AuthService,
    TodoListService,
    TaskService,
    ResponseService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
