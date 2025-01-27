import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { GlobalModule } from './global.module';
@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule
  ],
})
export class AppModule {}
