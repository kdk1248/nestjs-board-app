import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './common/unauthorization.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(process.env.PORT);
  Logger.log(`Application Running on Port: ${process.env.PORT}`)
}
bootstrap();
