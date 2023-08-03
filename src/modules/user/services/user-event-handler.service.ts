import { Injectable } from '@nestjs/common';
import { UserDeleteDto } from '../dto/user-delete.dto';
import { UserLoggedInDto } from '../dto/user-logged-in.dto';
import { UserJoinGroupDto } from '../dto/user-join-group.dto';
import { UserLeaveGroupDto } from '../dto/user-leave-group.dto';
import { UserNotifyDto } from '../dto/user-notify.dto';
import { UserService } from './user.service';
import { GroupUtility } from '../../group/group.utility';
import { FirebaseService } from '../../firebase/services/firebase.service';

@Injectable()
export class UserEventHandlerService {
  constructor(private readonly userService: UserService, private readonly firebaseService: FirebaseService) {}

  async userDelete(dto: UserDeleteDto) {
    console.log('---UserService.userDelete: ', dto);
    const tokens = await this.userService.findDeviceTokensById(dto.userId);
    const userGroups = await this.userService.findGroups(dto.userId);
    const promises: Promise<any>[] = userGroups.map((userGroup) => {
      return this.firebaseService.removeTokensFromTopic(GroupUtility.getFirebaseTopicName(userGroup.groupId), tokens);
    });
    promises.push(this.userService.removeAllTokens(dto.userId));
    promises.push(this.userService.removeAllUserGroups(dto.userId));
    await Promise.all(promises);
  }

  async userLoggedIn(dto: UserLoggedInDto) {
    console.log('---UserService.userLoggedIn: ', dto);
    await this.userService.addADeviceToken(dto.userId, dto.registrationToken);
    const userGroups = await this.userService.findGroups(dto.userId);
    const promises: Promise<any>[] = userGroups.map((userGroup) => {
      return this.firebaseService.addTokensToTopic(GroupUtility.getFirebaseTopicName(userGroup.groupId), [
        dto.registrationToken,
      ]);
    });
    await Promise.all(promises);
    return;
  }

  async userLoggedOut(dto: UserLoggedInDto) {
    console.log('---UserService.userLoggedOut: ', dto);
    await this.userService.removeADeviceToken(dto.registrationToken);
    const userGroups = await this.userService.findGroups(dto.userId);
    const promises: Promise<any>[] = userGroups.map((userGroup) => {
      return this.firebaseService.removeTokensFromTopic(GroupUtility.getFirebaseTopicName(userGroup.groupId), [
        dto.registrationToken,
      ]);
    });
    await Promise.all(promises);
    return;
  }

  async userJoinGroup(dto: UserJoinGroupDto) {
    console.log('---UserService.userJoinGroup: ', dto);
    const topicName = GroupUtility.getFirebaseTopicName(dto.groupId);
    const deviceTokens = await this.userService.findDeviceTokensById(dto.userId);
    await Promise.all([
      this.firebaseService.addTokensToTopic(topicName, deviceTokens),
      this.userService.adUserToGroup(dto.userId, dto.groupId),
    ]);
    return;
  }

  async userLeaveGroup(dto: UserLeaveGroupDto) {
    console.log('---UserService.userLeaveGroup: ', dto);
    const topicName = GroupUtility.getFirebaseTopicName(dto.groupId);
    const deviceTokens = await this.userService.findDeviceTokensById(dto.userId);
    await Promise.all([
      this.firebaseService.removeTokensFromTopic(topicName, deviceTokens),
      this.userService.removeUserFromGroup(dto.userId, dto.groupId),
    ]);
    return;
  }

  async userNotify(dto: UserNotifyDto) {
    console.log('---UserService.userNotify: ', dto);
    const deviceTokens = await this.userService.findDeviceTokensById(dto.userId);
    const failedTokens = await this.firebaseService.sendToDevices(
      {
        title: dto.title,
        body: dto.body,
        data: dto.metadata,
      },
      deviceTokens,
    );
    if (failedTokens.length) {
      await this.userService.removeTokens(failedTokens);
    }
    return;
  }
}
