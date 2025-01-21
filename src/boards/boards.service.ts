import { Injectable } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    //데이터베이스 
    private boards:Board[] = []
     //게시글 조회 기능
     getAllBoards():Board[]{
        return this.boards;
    }
    //특정 게시글 조회 기능 
    getBoardDetailById(id:number):Board{
        return this.boards.find((board) => board.id == id)

    }
    //키워드(작성자)로 검색한 게시글 조회 기능
    getBoardsByKeyword(author: string): Board[] {
        return this.boards.filter((board) => board.author === author);
    }

    //게시글 작성 기능
    createBoard(createBoardDto: CreateBoardDto){
        const {author, title, contents} =createBoardDto;

        const board:Board = {
            id: this.boards.length + 1, //값이 id로 들어가게, 임시 Auto Increament 기능
            author,
            title,
            contents,
            stauts: BoardStatus.PUBLIC
        }

        //const savedBoard = this.boards.push(board); <- 한번 더 랩핑한 것
        this.boards.push(board); //위의 받아온 데이터들로 board 객체를 만들었고 이것을 push 하다
        return board;
    }

    //특정 번호의 게시글 수정
    updateBoardById(id:number, updateBoardDto: UpdateBoardDto): Board{
        const foundBoard = this.getBoardDetailById(id);
        const {title, contents} = updateBoardDto;

        foundBoard.title = title;
        foundBoard.contents = contents;

        return foundBoard
    }

    //특정 번호의 게시글 일부 수정
    updateBoardStatusById(id:number, status: BoardStatus): Board{
        const foundBoard = this.getBoardDetailById(id);
        foundBoard.stauts = status;
        return foundBoard;
    }

    //게시글 삭제 기능
    deleteBoardId(id: number): void{
        this.boards = this.boards.filter((board)=> board.id != id);
    }
}

