import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config()

export const typeOrmConfig:TypeOrmModuleOptions = ({
    type: 'mysql', 
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    port: +(process.env.DB_PORT), // +, Number 를 작성해줘야 한다
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'], //엔티티 파일의 위치
    synchronize: true, //개발 중에만 true로 결정
    logging: true, //SQL 로그가 출력
});
