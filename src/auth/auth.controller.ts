import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { Response} from 'express';


@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private authService: AuthService
  ) { }

  // Sign-in
  @Post('/signin')
  async signin(@Body() signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<void> {
    this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

    const accessToken = await this.authService.signIn(signInRequestDto);

    // [2] JWT를 쿠키에 저장
    res.cookie('Authorization', accessToken);

    res.send({ message: "Login Success" });
    this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);

  }
}
