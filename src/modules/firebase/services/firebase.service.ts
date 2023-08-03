import { Injectable } from '@nestjs/common';
import { FirebaseMessageDto } from '../dto/firebase-message.dto';
import { getMessaging, Messaging, Message, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  firebaseMessaging: Messaging;

  constructor() {
    this.firebaseMessaging = getMessaging();
  }

  /**
   *
   * @param dto
   * @param registrationTokens This registration token comes from the client FCM SDKs
   */
  async sendToDevices(dto: FirebaseMessageDto, registrationTokens: string[]) {
    const message: MulticastMessage = {
      ...dto,
      tokens: registrationTokens,
    };
    const failedTokens = [];
    try {
      const res = await this.firebaseMessaging.sendEachForMulticast(message);
      console.log('Successfully sent message:', res);
      if (res.failureCount > 0) {
        res.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log('List of tokens that caused failures: ' + failedTokens);
      }
    } catch (e) {
      console.log('Error sending message:', e);
    }
    return failedTokens;
  }

  async sendToTopic(dto: FirebaseMessageDto, topicName: string) {
    const message: Message = {
      ...dto,
      topic: topicName,
    };
    try {
      const res = await this.firebaseMessaging.send(message);
      console.log('Successfully sent message:', res);
    } catch (e) {
      console.log('Error sending message:', e);
    }
  }

  /**
   * Subscribe the devices corresponding to the registration tokens to the topic
   * @param topicName
   * @param registrationTokens
   */
  async addTokensToTopic(topicName: string, registrationTokens: string[]) {
    try {
      const res = await this.firebaseMessaging.subscribeToTopic(registrationTokens, topicName);
      console.log('Successfully subscribed to topic:', res);
      if (res.errors.length) {
        console.log('---addTokensToTopic - error:');
        console.log(res.errors[0]);
      }
    } catch (e) {
      console.log('Error subscribing to topic:', e);
    }
  }

  async removeTokensFromTopic(topicName: string, registrationTokens: string[]) {
    try {
      const res = await this.firebaseMessaging.unsubscribeFromTopic(registrationTokens, topicName);
      console.log('Successfully unsubscribed from topic:', res);
    } catch (e) {
      console.log('Error unsubscribing from topic:', e);
    }
  }
}
