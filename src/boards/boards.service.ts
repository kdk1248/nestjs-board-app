import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRepository } from './boards.repository';

@Injectable() 
export class BoardsService {
    //Repository 계층 DI 
    constructor(private boardsRepository: BoardsRepository){}

    // 게시글 조회 기능  
    async getAllBoards(): Promise<Board[]> {  
        const foundBoards = await this.boardsRepository.findAll(); 
        return foundBoards; // foundBoards 반환  
    }

    // // 특정 게시글 조회 기능
    // getBoardDetailById(id: number): Board{
    //     const foundBoardId = this.boards.find((board) => board.id == id);
    //     if(!foundBoardId) {
    //         throw new NotFoundException(`Board with ID ${id} not found`);
    //     }
    //     return foundBoardId;
    // }

    // //키워드(작성자)로 검색한 게시글 조회 기능
    // getBoardsByKeyword(author: string): Board[] {
    //    const foundBoardKw = this.boards.filter((board) => board.author === author);
    //    if(foundBoardKw.length === 0){
    //         throw new NotFoundException(`Board with Keywod ${author} not found`); 
    //    } 
    //    return foundBoardKw;
    // }

    // // 게시글 작성 기능
    // createBoard(createboardDto: CreateBoardDto) {   //특수문자 x
    //     const {author, title, contents} = createboardDto;
        
    //     // 특수문자 검사 정규 표현식  
    //     const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;  

    //     // 예외 처리: 작성자에만 특수문자가 포함되어 있는지 확인  
    //     if (specialCharRegex.test(author)) {  
    //         throw new BadRequestException('Author must not contain special characters');  
    //     }  
    //     const board: Board = {
    //         id: this.boards.length + 1, // 임시 Auto Increament 기능
    //         author,
    //         title,
    //         contents,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);   
    //     return board; 
    // }

    // // 게시글 삭제 기능  
    // deleteBoardById(id: number): void {  
    //     // 게시글이 존재하는지 확인  
    //     const boardExists = this.boards.some((board) => board.id === id);  
    //     if (!boardExists) {  
    //         throw new NotFoundException(`Board with ID ${id} not found`);  
    //     }   
    //     this.boards = this.boards.filter((board) => board.id !== id);  
    // } 

    // // // 특정 번호의 게시글 일부 수정  
    // // updateBoardStatusById(id: number, status: BoardStatus): Board {  
    // //     const foundBoard = this.getBoardDetailById(id);  

    // //     // 예외 처리: 현재 상태가 PUBLIC일 때는 PUBLIC으로, PRIVATE일 때는 PRIVATE으로 변경할 수 없음  
    // //     if (foundBoard.status === BoardStatus.PUBLIC && status === BoardStatus.PUBLIC) {  
    // //         throw new BadRequestException('Cannot change status from PUBLIC to PUBLIC');  
    // //     }  

    // //     if (foundBoard.status === BoardStatus.PRIVATE && status === BoardStatus.PRIVATE) {  
    // //         throw new BadRequestException('Cannot change status from PRIVATE to PRIVATE');  
    // //     }  

    // //     foundBoard.status = status;   
    //     return foundBoard;  
    // }  

    // // 특정 번호의 게시글 수정
    // updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Board{  
    //     const foundBoard = this.getBoardDetailById(id);
    //     const {title, contents} = updateBoardDto;

    //     if(!title || !contents){
    //         throw new BadRequestException('Title and contents must be provided');
    //     }
    //     foundBoard.title = title;
    //     foundBoard.contents = contents;

    //     return foundBoard;

    // }
    
}