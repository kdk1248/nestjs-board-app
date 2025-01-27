import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UserRole } from './users-role.enum';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  // 회원 가입 기능
  async createUser(createuserDto: CreateUserDto): Promise<User> {   //특수문자 x
    const { email, username, password, role } = createuserDto;
    if (!email || !username || !password! || role) {
      throw new BadRequestException('Something went wrong.') //특정 필드 언급하지않도록 -> 보안의 중요성성
    }

    await this.checkEmailExist(email);

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(password);

    const newUser: User = {
      id: 0,
      email,
      username,
      password,
      role: UserRole.USER
    };
    const createUser = await this.userRepository.save(newUser);
    return createUser;
  }

  //로그인 기능
  async signIn(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;
    
    const existingUser = await this.checkEmailExist(email);

    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const message = 'Login success';
    return message;

  }

  async findUserByEmail(email: string): Promise<User>{
    const exisitngUser = await this.userRepository.findOne({where: {email}});
    if(!exisitngUser){
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