import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getInfo() {
    return {
      'App name: ': this.configService.get('APP_NAME'),
      'Time: ': new Date().toISOString(),
    };
  }
}
