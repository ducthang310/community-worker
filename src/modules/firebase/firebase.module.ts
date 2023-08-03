import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { initializeApp, cert } from 'firebase-admin/app';

initializeApp({
  credential: cert({
    projectId: 'PROJECT_ID',
    privateKey: 'PRIVATE_KEY',
    clientEmail: 'CLIENT_EMAIL',
  }),
});

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
