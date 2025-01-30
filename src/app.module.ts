import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { GlobalModule } from './global.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './common/unauthorization.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule
  ],
  providers:[
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter, //전액 필터 등록록
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

  ]
})
export class AppModule {}
