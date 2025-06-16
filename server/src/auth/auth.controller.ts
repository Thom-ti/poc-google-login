import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { RequestUser } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {
    // เมื่อผู้ใช้เข้า /auth/google
    // GoogleAuthGuard จะ intercept request และ redirect ไปยัง Google OAuth page ให้อัตโนมัติ
    // ในกรณีนี้ method googleLogin() จะไม่ถูกเรียกเลย เพราะ guard จัดการเองหมดแล้ว
    // ไม่ต้องเขียนอะไรเพิ่มใน googleLogin() เว้นแต่จะ debug
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as RequestUser;
    const { accessToken } = await this.authService.googleLogin(user);

    if (!accessToken) {
      return res.redirect('http://localhost:4200/');
    }

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite:
        this.config.get<string>('NODE_ENV') === 'production' ? 'strict' : 'lax', // ถ้าใช้ HTTPS ต้องเปลี่ยนเป็น 'strict'
      secure: this.config.get<string>('NODE_ENV') !== 'development', // ต้องเปิดเป็น true ถ้าใช้ HTTPS แม้จะเป็น development
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.redirect('http://localhost:4200/user');

    // req มาจาก GoogleStrategy
    // หลังผู้ใช้ login ที่ Google สำเร็จ → Google จะ redirect กลับมายัง URL นี้ พร้อม Authorization code
    // GoogleAuthGuard จะแลก Authorization code เป็น accessToken แล้วเรียก method validate() ที่อยู่ใน GoogleStrategy
    // ค่า req.user มาจาก GoogleStrategy.validate() → แล้ว method googleCallback() จะถูกเรียกต่อ
    // authService.googleLogin(req) ทำหน้าที่สร้าง JWT หรือจัดการ session ภายในแอป
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite:
        this.config.get<string>('NODE_ENV') === 'production' ? 'strict' : 'lax', // ถ้าใช้ HTTPS ต้องเปลี่ยนเป็น 'strict'
      secure: this.config.get<string>('NODE_ENV') !== 'development', // ต้องเปิดเป็น true ถ้าใช้ HTTPS แม้จะเป็น development
    });

    return { message: 'Logged out' };
  }
}
