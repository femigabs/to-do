import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../database/models';
import { ResponseService } from 'src/common';

@Module({
    imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
        TypeOrmModule.forFeature([User]),
      ],
    controllers: [AuthController],
    providers: [AuthService, ResponseService],
    exports: [AuthService, ResponseService],
})

export class AuthModule { }