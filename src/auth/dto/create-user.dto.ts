import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../users-role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[가-힣]+$/, {message: 'Username us invalid'})
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', }) //대소문자 포함함
    password: string;


    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

}