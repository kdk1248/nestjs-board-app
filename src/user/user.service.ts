import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './user-role.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // CREATE
  async createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
    this.logger.verbose(`Visitor is creating a new acount with title: ${createUserRequestDto.email}`);

    const { email, username, password, role } = createUserRequestDto;
    if (!email || !username || !password! || role) {
      throw new BadRequestException('Something went wrong.') //특정 필드 언급하지않도록 -> 보안의 중요성성
    }

    await this.checkEmailExist(email);

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const createUser = await this.userRepository.save(newUser);

    this.logger.verbose(`New account email with ${createUser.email} created Successfully`)
    return createUser;
  }

  //Existing Checker
  async checkEmailExist(email: string): Promise<User> {
    const exisitngUser = await this.userRepository.findOne({ where: { email } })
    if (!exisitngUser) {
      throw new ConflictException('Email already exists');
    } return exisitngUser;
  }

  //Hasing Password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(); // 솔트 생성
    return await bcrypt.hash(password, salt); // 비밀번호 해싱
  }

  //READ - by Email
  async findUserByEmail(email: string): Promise<User> {
    const exisitngUser = await this.userRepository.findOne({ where: { email } });
    if (!exisitngUser) {
      throw new NotFoundException('User not found');
    }
    return exisitngUser;
  }
}
