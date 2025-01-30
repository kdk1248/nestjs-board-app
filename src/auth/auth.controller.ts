import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { Response} from 'express';


@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private authService: AuthService
  ) { }

  // 회원 가입 기능
  @Post('/signup')
  async createUser(@Body() signUpRequestDto: SignUpRequestDto): Promise<UserResponseDto> {
    this.logger.verbose(`Visitor is try to creating a new board with title: ${signUpRequestDto.email}`);

    const userResponseDto = new UserResponseDto(await this.authService.createUser(signUpRequestDto));
    
    this.logger.verbose(`New account email with ${userResponseDto.email} created Successfully`)
    return userResponseDto;
  }

  // 로그인 기능
  @Post('/signin')
  async signin(@Body() signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<void> {
    this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

    const accessToken = await this.authService.signIn(signInRequestDto, res);

    // [2] JWT를 쿠키에 저장
    res.cookie('Authorization', accessToken);

    res.send({ message: "Login Success" });
    this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);

  }
}
