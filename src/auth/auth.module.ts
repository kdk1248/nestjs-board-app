import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports:[
    TypeOrmModule.forFeature([User]), //Board 엔터티를 TypeORM 모듈에 등록



  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
