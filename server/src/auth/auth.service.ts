import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async googleLogin(req: any): Promise<{ accessToken: string; user: any }> {
    const user = req.user;

    if (!user) {
      throw new Error('Google login failed: No user information received.');
    }

    const payload = {
      sub: user.googleId,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
