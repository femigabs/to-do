import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  });

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);

  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector, authService));

  const configService = app.get(ConfigService);

  // Default to 3000 if PORT is not set
  const port = configService.get('PORT', 3000);

  app.enableCors();

  await app.listen(port);

  app.enableCors();

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
