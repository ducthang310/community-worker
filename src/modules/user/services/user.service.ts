import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../entities/device.entity';
import { In, Repository } from 'typeorm';
import { UserGroup } from '../entities/user-group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Device)
    private repositoryDevice: Repository<Device>,
    @InjectRepository(UserGroup)
    private repositoryUserGroup: Repository<UserGroup>,
  ) {}

  async findDeviceTokensById(userId: string) {
    const records = await this.repositoryDevice.findBy({ userId });
    return records.map((item) => item.deviceToken);
  }

  async removeADeviceToken(deviceToken: string) {
    return this.repositoryDevice.delete({ deviceToken });
  }

  async addADeviceToken(userId: string, deviceToken: string) {
    const item = this.repositoryDevice.create({ userId, deviceToken });
    return this.repositoryDevice.save(item);
  }

  async removeAllTokens(userId: string) {
    return this.repositoryDevice.delete({ userId });
  }

  async findGroups(userId: string) {
    return this.repositoryUserGroup.findBy({ userId });
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    return this.repositoryUserGroup.delete({ userId, groupId });
  }

  async adUserToGroup(userId: string, groupId: string) {
    const item = this.repositoryUserGroup.create({ userId, groupId });
    return this.repositoryUserGroup.save(item);
  }

  async removeAllUserGroups(userId: string) {
    return this.repositoryUserGroup.delete({ userId });
  }

  async removeTokens(tokens: string[]) {
    return this.repositoryDevice.delete({
      deviceToken: In(tokens),
    });
  }
}
