import { User } from "../entities/users.entity";
import { UserRole } from "../users-role.enum";

export class UserResponseDto {
    id: number;
    username:string;
    email:string;
    role:UserRole;

    constructor(user: User){
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
    }
}
