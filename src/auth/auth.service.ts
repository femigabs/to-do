import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HelperService, ResponseService } from '../common';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/database/models';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private responseService: ResponseService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async create(data: CreateUserDto): Promise<Partial<User>> {
        try {
            const { password } = data;
            const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = this.userRepository.create({ ...data, password: hashedPassword });

            const savedUser = await this.userRepository.save(user);

            const { password: _, deletedAt, ...result } = savedUser;

            return result;

        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY') {
                error.message = 'User already exists';
            }
            
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findOneByUserId(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.findOneByEmail(email);
        if (!user) {
            return null;
        }
        const isValid = await bcrypt.compare(pass, user.password);
        if (isValid) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(data: LoginUserDto) {
        try {
            const user = await this.validateUser(data.email, data.password);
            if (!user) {
                throw this.responseService.generateErrorResponse('Invalid credentials', 401);
            }

            const { password, ...result } = user;

            const payload = { email: user.email, user_id: user.id, first_name: user.first_name };
            
            const token = await this.jwtService.signAsync(payload);
            return {
                ...result,
                access_token: token,
            };
        } catch (error) {
            throw this.responseService.generateErrorResponse(error.message, error?.statusCode);
        }
    }
};
