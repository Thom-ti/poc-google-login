import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req) {
    // เมื่อผู้ใช้เข้า /auth/google
    // GoogleAuthGuard จะ intercept request และ redirect ไปยัง Google OAuth page ให้อัตโนมัติ
    // ในกรณีนี้ method googleLogin() จะไม่ถูกเรียกเลย เพราะ guard จัดการเองหมดแล้ว
    // ไม่ต้องเขียนอะไรเพิ่มใน googleLogin() เว้นแต่จะ debug
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req) {
    // const { accessToken } = await this.authService.googleLogin(req);
    // res.cookie('access_token', accessToken, {
    //   httpOnly: true,
    // });
    // res.redirect('/');

    // req มาจาก GoogleStrategy
    return this.authService.googleLogin(req);
    // หลังผู้ใช้ login ที่ Google สำเร็จ → Google จะ redirect กลับมายัง URL นี้ พร้อม Authorization code
    // GoogleAuthGuard จะแลก Authorization code เป็น accessToken แล้วเรียก method validate() ที่อยู่ใน GoogleStrategy
    // ค่า req.user มาจาก GoogleStrategy.validate() → แล้ว method googleCallback() จะถูกเรียกต่อ
    // authService.googleLogin(req) ทำหน้าที่สร้าง JWT หรือจัดการ session ภายในแอป
  }
}
