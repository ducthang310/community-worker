import { Controller, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('user.create')
  handleUserCreate(@Payload(ValidationPipe) data: any) {
    this.userService.userCreate(data);
  }
}
