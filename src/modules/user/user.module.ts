import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEventHandlerService } from './services/user-event-handler.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { Device } from './entities/device.entity';
import { UserGroup } from './entities/user-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, UserGroup]), FirebaseModule],
  controllers: [UserController],
  providers: [UserService, UserEventHandlerService],
})
export class UserModule {}
