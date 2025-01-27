import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UserRole } from './users-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  
  // 회원 가입 기능
  async createUser(createuserDto: CreateUserDto): Promise<User> {   //특수문자 x
    const { email, username, password,role } = createuserDto;
    if (!email || !username || !password !||role) {
      throw new BadRequestException('Something went wrong.') //특정 필드 언급하지않도록 -> 보안의 중요성성
    }
    await this.checkEmailExist(email);

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

  async checkEmailExist(email:string):Promise<void>{
    const exisitngUser= await this.userRepository.findOne({where : {email}})
    if(exisitngUser){
      throw new ConflictException('Email already exists');
    }
  }

}