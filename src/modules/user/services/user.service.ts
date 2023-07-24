import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  userCreate(dto: CreateUserDto) {
    console.log('---UserService.userCreate: ', dto);
  }
}
