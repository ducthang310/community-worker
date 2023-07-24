import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';

@Injectable()
export class GroupService {
  groupCreate(dto: CreateGroupDto) {
    console.log('---GroupService.groupCreate: ', dto);
  }
}
