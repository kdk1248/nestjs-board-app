import { User } from "src/auth/entities/users.entity";
import { BoardStatus } from "../boards-status.enum";
import { Board } from "../boards.entity";
import { UserResponseDto } from "src/auth/dto/user-response.dto";

export class BoardResponseDto{
    id:number;
    author: string;
    title:string;
    contents:string;
    status: BoardStatus;

    constructor(board: Board){
        this.id = board.id;
        this.author = board.author;
        this.title = board.title;
        this.contents = board.contents;
        this.status = board.status;
}
}