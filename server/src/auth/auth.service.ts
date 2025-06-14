import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtPayload } from './strategies/jwt-auth.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { googleId, email, name, picture } = req.user;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        googleId,
        email,
        name,
        picture,
      });
      await user.save();
    }

    const payload: JwtPayload = {
      sub: user.googleId,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
