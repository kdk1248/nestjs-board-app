import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';

@Controller('api/boards')
export class BoardsController {
    //생성자 주입
    constructor(private boardService: BoardsService) { }

    //게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardService.getAllBoards();
    }

    //게시글 작성 기능
    @Post('/')
    createBoard(
        @Body('author') author:string,
        @Body('title') title:string,
        @Body('contents') contents:string,
    ){
        return this.boardService.createBoard(author, title, contents);
    }
}
