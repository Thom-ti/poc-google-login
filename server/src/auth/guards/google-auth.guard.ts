import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
      // prompt: 'consent',
    });
  }
}
// GoogleAuthGuard → เป็น AuthGuard('google') ที่ใช้ passport-google-oauth20
