import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { TRequestUser } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}

  private getCookieOptions(): Partial<CookieOptions> {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      sameSite: isProd ? 'strict' : 'lax',
      secure: isProd,
      maxAge: 8 * 3600_000, // 1 ชั่วโมง
    };
  }

  private getCookieClearOptions(): Partial<CookieOptions> {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      sameSite: isProd ? 'strict' : 'lax',
      secure: isProd,
    };
  }

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
    const user = req.user as TRequestUser;
    const { jwt, accessToken, userInfo } =
      await this.authService.googleLogin(user);

    if (!jwt) {
      return res.redirect('http://localhost:4200/');
    }

    const cookieOptions = this.getCookieOptions();

    res.cookie('jwt', jwt, cookieOptions);
    res.cookie('googleAccessToken', accessToken, cookieOptions);
    res.cookie('userInfo', userInfo, cookieOptions);

    return res.redirect('http://localhost:4200/user');

    // req มาจาก GoogleStrategy
    // หลังผู้ใช้ login ที่ Google สำเร็จ → Google จะ redirect กลับมายัง URL นี้ พร้อม Authorization code
    // GoogleAuthGuard จะแลก Authorization code เป็น accessToken แล้วเรียก method validate() ที่อยู่ใน GoogleStrategy
    // ค่า req.user มาจาก GoogleStrategy.validate() → แล้ว method googleCallback() จะถูกเรียกต่อ
    // authService.googleLogin(req) ทำหน้าที่สร้าง JWT หรือจัดการ session ภายในแอป
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieOptions = this.getCookieClearOptions();

    res.clearCookie('jwt', cookieOptions);
    res.clearCookie('googleAccessToken', cookieOptions);
    res.clearCookie('userInfo', cookieOptions);

    return { message: 'Logged out' };
  }
}
