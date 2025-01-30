import { Controller, Post, Body, Res, Req, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response ,Request} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/users.entity';
import { GetUser } from './get-user.decorator';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private authService: AuthService
  ) { }

  // 회원 가입 기능
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.verbose(`Visitor is try to creating a new board with title: ${createUserDto.email}`);

    const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto));
    
    this.logger.verbose(`New account email with ${userResponseDto.email} created Successfully`)
    return userResponseDto;
  }

  // 로그인 기능
  @Post('/signin')
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
    this.logger.verbose(`User with email: ${loginUserDto.email} is try to signing in`);

    const accessToken = await this.authService.signIn(loginUserDto, res);

    // [2] JWT를 쿠키에 저장
    res.cookie('Authorization', accessToken);

    res.send({ message: "Login Success" });
    this.logger.verbose(`User with email: ${loginUserDto.email} issued JWT ${accessToken}`);

  }
}
