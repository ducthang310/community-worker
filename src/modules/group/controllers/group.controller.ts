import { Controller, ValidationPipe } from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @EventPattern('group.create')
  handleGroupCreate(@Payload(ValidationPipe) data: any) {
    this.groupService.groupCreate(data);
  }
}
