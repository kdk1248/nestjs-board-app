import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // 회원 가입 기능
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto))
    return userResponseDto;
  }

  // 로그인 기능
  @Post('/signin')
  async signin(@Body() loginUserDto: LoginUserDto): Promise<string>{
    const message = this.authService.signIn(loginUserDto);
    return message;

  }
}