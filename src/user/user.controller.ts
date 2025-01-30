import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { UserService } from './user.service';

import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  //CREATE
  @Post('/')
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserResponseDto> {
    this.logger.verbose(`Visitor is try to creating a new board with title: ${createUserRequestDto.email}`);

    const userResponseDto = new UserResponseDto(await this.userService.createUser(createUserRequestDto));

    this.logger.verbose(`New account email with ${userResponseDto.email} created Successfully`)
    return userResponseDto;
  }

}