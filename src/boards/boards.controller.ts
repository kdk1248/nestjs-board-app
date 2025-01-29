import { Controller, Get, Param, Post, Query, Patch, Put, UsePipes, ValidationPipe, Body, Delete, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { BoardResponseDto } from './dto/board-response.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardSearchResponseDto } from './dto/board-search-response.dto';
import { BoardStatusValidationPipe } from './pipes/board-stauts-validation.pipe';
import { BoardStatus } from './boards-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/users-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entities/users.entity';

@Controller('api/boards')
@UseGuards(AuthGuard(), RolesGuard) //로그인 유저가 USER 만 접근 가능능
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)
    async getAllBoards(): Promise<BoardResponseDto[]> {
        const boards: Board[] = await this.boardsService.getAllBoards(); // 비동기적으로 게시글 가져오기
        const boardResponseDto = boards.map(board => new BoardResponseDto(board))
        return boardResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    async getBoardDetailById(@Param('id') id: number): Promise<BoardResponseDto> {
        const boardResponseDto = new BoardResponseDto(await this.boardsService.getBoardDetailById(id));
        return boardResponseDto;
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getBoardsByKeyword(@Query('author') author: string): Promise<BoardSearchResponseDto[]> {
        const boards: Board[] = await this.boardsService.getBoardsByKeyword(author);
        const boardSearchResponseDto = boards.map(board => new BoardSearchResponseDto(board));
        return boardSearchResponseDto;
    }

    // 게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() logginedUser: User): Promise<BoardResponseDto> {
        const boardResponseDto = new BoardResponseDto(await this.boardsService.createBoard(createBoardDto, logginedUser))
        return boardResponseDto;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById( 
        @Param('id') id: number,
        @Body() updateBoardDto: UpdateBoardDto,): Promise<BoardResponseDto> {
        const updatedBoard = await this.boardsService.updateBoardById(id, updateBoardDto);
        return new BoardResponseDto(updatedBoard);
    }

    // 특정 번호의 게시글 일부 수정
    @Patch('/:id/status')
    async updateBoardStatusById(
        @Param('id') id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<void> {
        await this.boardsService.updateBoardStatusById(id, status);
    }

    // 게시글 삭제 기능
    @Delete('/:id')
    async deleteBoardById(@Param('id') id: number): Promise<void> {
        await this.boardsService.deleteBoardById(id);
    }
}