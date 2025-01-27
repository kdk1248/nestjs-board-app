import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express'; 
import { log } from 'console';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원 가입 기능
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userResponseDto = new UserResponseDto(
      await this.authService.createUser(createUserDto),
    );
    return userResponseDto;
  }

  // 로그인 기능
  @Post('/signin')
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
    const accessToken = await this.authService.signIn(loginUserDto,res);
    
    // [2] JWT를 쿠키에 저장
    res.cookie('Authorization', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 360000,
      sameSite: 'none'
    });
    res.send({ message: "Login Success" });
  }
}
