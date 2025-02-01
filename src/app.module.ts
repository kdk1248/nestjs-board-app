import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { GlobalModule } from './global.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { UserModule } from './user/user.module';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';
@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
    UserModule
  ],
  providers:[
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter, 
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

  ]
})
export class AppModule {}
