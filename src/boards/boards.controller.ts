import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { create } from 'domain';

@Controller('api/boards')
export class BoardsController {
    //생성자 주입
    constructor(private boardService: BoardsService) { }

    //게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardService.getAllBoards();
    }
    //특정 게시글 조회 기능
    @Get('/:id')
    getBoardDetailById(@Param('id') id: number): Board {
        return this.boardService.getBoardDetailById(id);
    }
    //키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    getBoardsByKeyword(@Query('author') author: string): Board[] {
        return this.boardService.getBoardsByKeyword(author);
    }
    //게시글 작성 기능
    @Post('/')
    createBoard(@Body() createBoardDto: CreateBoardDto)  {
        return this.boardService.createBoard(createBoardDto)
    }
    //게시글 삭제 기능
    @Delete('/:id')
    deleteBoardId(@Param('id') id: number): void {
        this.boardService.deleteBoardId(id);
    }
}
