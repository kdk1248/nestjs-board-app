import { Controller, Get, Param, Post, Query, Patch, Put, UsePipes, ValidationPipe, Body, Delete, UseGuards,Logger } from '@nestjs/common';
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
@UseGuards(AuthGuard(), RolesGuard)
export class BoardsController {
    private readonly logger = new Logger(BoardsService.name);

    // 생성자 주입
    constructor(private boardsService: BoardsService) { }

    // 게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() logginedUser: User): Promise<BoardResponseDto> {
        this.logger.verbose(`User:${logginedUser.username} is creating a new board with title: ${createBoardDto.title}`);
        
        const boardResponseDto = new BoardResponseDto(await this.boardsService.createBoard(createBoardDto, logginedUser))
        
        this.logger.verbose(`Board title with ${boardResponseDto.title} created Successfully`)
        return boardResponseDto;
    }

    // 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)//로그인 유저가 USER 만 접근 가능 
    async getAllBoards(): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Try to Retrieving all Boards`);

        const boards: Board[] = await this.boardsService.getAllBoards(); // 비동기적으로 게시글 가져오기
        const boardResponseDto = boards.map(board => new BoardResponseDto(board))
        
        this.logger.verbose(`Retrieved all Boards list Successfully`);

        return boardResponseDto;
    }
    //나의 게시글 조회 기능(로그인 유지지)
    @Get('/myboards')
    async getMyAllBoards(@GetUser() logginedUser: User): Promise<BoardResponseDto[]> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Boards list`);
        
        const boards: Board[] = await this.boardsService.getMyAllBoards(logginedUser); // 비동기적으로 게시글 가져오기
        const boardResponseDto = boards.map(board => new BoardResponseDto(board))
        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Boards list Successfully`);

        return boardResponseDto;
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    async getBoardDetailById(@Param('id') id: number): Promise<BoardResponseDto> {
        this.logger.verbose(`Try to Retrieving a board by id: ${id}`);

        const boardResponseDto = new BoardResponseDto(await this.boardsService.getBoardDetailById(id));
        this.logger.verbose(`Retrieved a board by ${id} details Successfully`);

        return boardResponseDto;
    }

    // 키워드(작성자)로 검색한 게시글 조회 기능
    @Get('/search/:keyword')
    async getBoardsByKeyword(@Query('author') author: string): Promise<BoardSearchResponseDto[]> {
        this.logger.verbose(`Try to Retrieving a board by author: ${author}`);

        const boards: Board[] = await this.boardsService.getBoardsByKeyword(author);
        const boardSearchResponseDto = boards.map(board => new BoardSearchResponseDto(board));
        
        this.logger.verbose(`Retrieved boards list by ${author} details Successfully`);

        return boardSearchResponseDto;
    }

    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(
        @Param('id') id: number,
        @Body() updateBoardDto: UpdateBoardDto,): Promise<BoardResponseDto> {
        this.logger.verbose(`Try to Updating a board by id: ${id} with updatedBoardDto`);

        const updatedBoard = await this.boardsService.updateBoardById(id, updateBoardDto);
        
        this.logger.verbose(`Updated a board by ${id} Successfully`);

        return new BoardResponseDto(updatedBoard);
    }

    // 특정 번호의 게시글 일부 수정<ADMIN 기능>
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    async updateBoardStatusById(
        @Param('id') id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<void> {
        this.logger.verbose(` ADMING is trying to updating a board by id: ${id} with status: ${status}`);

        await this.boardsService.updateBoardStatusById(id, status);

        this.logger.verbose(`ADMIN Updated a board's status to ${status} Successfully`);

    }

    // 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteBoardById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username}is trying to udeleting a board by id: ${id}`);

        await this.boardsService.deleteBoardById(id, logginedUser);

        this.logger.verbose(`Deleted a board by to ${id} Successfully`);

    }
}