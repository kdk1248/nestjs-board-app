import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise"; //promise -> 성공과 실패가 있는 객체를 사용하기 위함
import { databaseConfig } from "../configs/database.config";
import { Board } from "./boards.entity";

@Injectable()
export class BoardsRepository{
    private connectionPool: Pool
    constructor(){
        this.connectionPool = createPool(databaseConfig);
        this.connectionPool.getConnection()
            .then(()=> console.log('DB Connected'))
            .catch(err => console.error('DB Connection faild',err));
    }

    //게시글 조회관련 데이터 엑세스
    async findAll(): Promise<Board[]> {
        const selectQuery = `SELECT * FROM board`;
        try{
            const [result] = await this.connectionPool.query(selectQuery)
            return result as Board[]
        }catch (err){
            throw new InternalServerErrorException('Database query failed', err);
        }
    }

    async saveBoard(board: Board): Promise<string> {
        const insertQuery = 'INSERT INTO board (author, title, contents, status) VALUES (?, ?, ?, ?)';
        
        try {
            const [result] = await this.connectionPool.query(insertQuery, [board.author, board.title, board.contents, board.status]);
    
            // 성공 메시지를 반환
            const message = 'Created successfully!';
            return message;
        } catch (err) {
            // 오류를 처리하고 예외를 던짐
            throw new InternalServerErrorException('Database query failed', err);
        }
    }
    

    
       
}