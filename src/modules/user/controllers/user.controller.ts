import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserEventHandlerService } from '../services/user-event-handler.service';
import { UserLoggedInDto } from '../dto/user-logged-in.dto';
import { UserJoinGroupDto } from '../dto/user-join-group.dto';
import { UserLeaveGroupDto } from '../dto/user-leave-group.dto';
import { UserDeleteDto } from '../dto/user-delete.dto';
import { UserNotifyDto } from '../dto/user-notify.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userEventHandlerService: UserEventHandlerService) {}

  @EventPattern('user.logged_in')
  handleUserLoggedIn(@Payload(ValidationPipe) data: UserLoggedInDto) {
    return this.userEventHandlerService.userLoggedIn(data);
  }

  @EventPattern('user.logged_out')
  handleUserLoggedOut(@Payload(ValidationPipe) data: UserLoggedInDto) {
    return this.userEventHandlerService.userLoggedOut(data);
  }

  @EventPattern('user.join_group')
  handleUserJoinGroup(@Payload(ValidationPipe) data: UserJoinGroupDto) {
    return this.userEventHandlerService.userJoinGroup(data);
  }

  @EventPattern('user.leave_group')
  handleUserLeaveGroup(@Payload(ValidationPipe) data: UserLeaveGroupDto) {
    return this.userEventHandlerService.userLeaveGroup(data);
  }

  @EventPattern('user.delete')
  handleUserDelete(@Payload(ValidationPipe) data: UserDeleteDto) {
    return this.userEventHandlerService.userDelete(data);
  }

  @EventPattern('user.notify')
  handleUserNotify(@Payload(ValidationPipe) data: UserNotifyDto) {
    return this.userEventHandlerService.userNotify(data);
  }
}
