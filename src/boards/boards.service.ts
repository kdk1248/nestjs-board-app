import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/auth/entities/users.entity';

@Injectable()
export class BoardsService {
    //Repository 계층 DI 
    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>
    ) { }

    // 게시글 조회 기능  
    async getAllBoards(): Promise<Board[]> {
        const foundBoards = await this.boardsRepository.find();
        return foundBoards; // foundBoards 반환  
    }
    // 게시글 조회 기능  
    async getMyAllBoards(logginedUser: User): Promise<Board[]> {
        // 기본 조회에서는 엔터티를 즉시로딩으로 변경해야 User 에 접근 할 수 있다.
        // const foundBoards = await this.boardsRepository.findBy({user: logginedUser});

        // 쿼리 빌더를 통해 lazy loading 설정된 엔터티와 관계를 가진 엔터티 (User) 명시적 접근
        const foundBoards = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user','user') //사용자 정보를 조인(레이지 로딩 상태에서 User 추가 쿼리)
            .where('board.userId = :userId', {userId: logginedUser.id})
            .getMany(); //'select * from board where id = logginedUserId'
        return foundBoards; // foundBoards 반환  
    }

    // // 특정 게시글 조회 기능
    async getBoardDetailById(id: number): Promise<Board> {
        const foundBoard = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user','user') //사용자 정보를 조인
            .where('board.id = id', {id})
            .getOne(); 
        if(!foundBoard){
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return foundBoard;
    }    

    // //키워드(작성자)로 검색한 게시글 조회 기능
    async getBoardsByKeyword(author: string): Promise<Board[]> {
        if (!author) {
            throw new BadRequestException('AUthor keyword must be provided')
        }
        const foundBoards = this.boardsRepository.findBy({ author: author })

        if ((await foundBoards).length === 0) {
            throw new NotFoundException(`No boards found for author: ${author}`)
        }
        return foundBoards;
    }

    // 게시글 작성 기능
    async createBoard(createboardDto: CreateBoardDto, logginedUser : User): Promise<Board> {   //특수문자 x
        const { title, contents } = createboardDto;
        if ( !title || !contents) {
            throw new BadRequestException(' Title, and contents musst be provided')
        }
        const newboard: Board = this.boardsRepository.create({
            author: logginedUser.username,
            title,
            contents,
            status: BoardStatus.PUBLIC,
            user: logginedUser 
        });

        const createBoard = await this.boardsRepository.save(newboard);
        return createBoard;
    }

    // 특정 번호의 게시글 수정
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        const foundBoard = await this.getBoardDetailById(id);
        const { title, contents } = updateBoardDto;

        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided');
        }
        foundBoard.title = title;
        foundBoard.contents = contents;

        const updateBoard = await this.boardsRepository.save(foundBoard)
        return updateBoard;

    }
    // 특정 번호의 게시글 일부 수정  
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {  
        const result = await this.boardsRepository.update(id, {status});  
        if (result.affected === 0){  
            throw new BadRequestException(`Board with ID ${id} Not Found`);  
        }
    }   

    // // 게시글 삭제 기능  
    async deleteBoardById(id: number,logginedUser:User): Promise<void> {  
        const foundBoard = await this.getBoardDetailById(id);
        // 작성자와 요청한 사용자가 같은지 확인
        if (foundBoard.user.id !== logginedUser.id){
            throw new UnauthorizedException('Do not have permission to delete this board')
        }
        await this.boardsRepository.delete(foundBoard);  
    } 

}