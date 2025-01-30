import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcryptjs';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  // 회원 가입 기능
  async createUser(signUpRequestDto: SignUpRequestDto): Promise<User> {   //특수문자 x
    this.logger.verbose(`Visitor is creating a new acount with title: ${signUpRequestDto.email}`);

    const { email, username, password, role } = signUpRequestDto;
    if (!email || !username || !password! || role) {
      throw new BadRequestException('Something went wrong.') //특정 필드 언급하지않도록 -> 보안의 중요성성
    }

    await this.checkEmailExist(email);

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create( {
      id: 0,
      email,
      username,
      password:hashedPassword,
      role: UserRole.USER,
    });

    const createUser = await this.userRepository.save(newUser);
    
    this.logger.verbose(`New account email with ${createUser.email} created Successfully`)
    return createUser;
  }

  //로그인 기능
  async signIn(signInRequestDto: SignInRequestDto, @Res() res: Response): Promise<string> {
    this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

    const { email, password } = signInRequestDto;
    try {
      const existingUser = await this.checkEmailExist(email);

      if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        this.logger.error(`Invalid credentials`);

        throw new UnauthorizedException('Invalid credentials');
      }
      // [1] JWT 토큰 생성
      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role
      };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);

      return accessToken;
    } catch (error) {
      this.logger.error(`Invalid credentials or Internal Server error`);
      throw error;
    }
  }
  async findUserByEmail(email: string): Promise<User> {
    const exisitngUser = await this.userRepository.findOne({ where: { email } });
    if (!exisitngUser) {
      throw new NotFoundException('User not found');
    }
    return exisitngUser;
  }

  async checkEmailExist(email: string): Promise<User> {
    const exisitngUser = await this.userRepository.findOne({ where: { email } })
    if (!exisitngUser) {
      throw new ConflictException('Email already exists');
    } return exisitngUser;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(); // 솔트 생성
    return await bcrypt.hash(password, salt); // 비밀번호 해싱
  }
}