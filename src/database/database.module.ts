import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Task, TodoList, User } from './models';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USERNAME', 'root'),
        password: configService.get<string>('DATABASE_PASSWORD', 'password'),
        database: configService.get<string>('DATABASE_NAME', 'todos'),
        entities: [User, TodoList, Task],
        synchronize: configService.get<boolean>('DATABASE_SYNC', true), // Set to false in production
        driver: require('mysql2')
      }),
    }),
  ],
})

export class DatabaseModule {}
