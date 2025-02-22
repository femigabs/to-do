import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpCode,
    UseFilters,
    Get,
    Param,
    Delete,
    Put
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoiValidationPipe, ResponseService } from '../common';
import { createUserSchema, loginUserSchema } from './create.auth.validations';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseService: ResponseService,
    ) { }

    @Public()
    @Post('/register')
    @HttpCode(201)
    async createUser(
        @Body(new JoiValidationPipe(createUserSchema)) payload: CreateUserDto
    ) {
        try {
            
            const user = await this.authService.create(payload);

            return this.responseService.generateSuccessResponse(
                user,
                'User created successfully',
                201,
            );
        } catch (error) {
            const message = error.message || 'Error creating user';

            throw new HttpException(message, error?.statusCode || 400);
        }
    }

    @Public()
    @Post('/login')
    @HttpCode(200)
    async loginUser(
        @Body(new JoiValidationPipe(loginUserSchema)) payload: LoginUserDto
    ) {
        try {
            const user = await this.authService.login(payload);

            return this.responseService.generateSuccessResponse(
                user,
                'User logged in successfully',
            );
        } catch (error) {
            const message = error.message || 'Error logging in user';

            throw new HttpException(message, error?.statusCode || 400);
        }
    }
}
