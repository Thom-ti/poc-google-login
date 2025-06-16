import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtPayload, RequestUser } from 'src/shared/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async googleLogin(user: RequestUser) {
    if (!user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { googleId, email, name, picture } = user;
    let findUser = await this.userModel.findOne({ email });

    let role: string;
    if (email.endsWith('hr@myorder.ai')) {
      role = 'hr';
    } else {
      role = 'employee';
    }

    if (!findUser) {
      findUser = new this.userModel({
        googleId,
        email,
        name,
        picture,
        role,
      });
      await findUser.save();
    }

    const payload: JwtPayload = {
      sub: findUser.googleId,
      email: findUser.email,
      name: findUser.name,
      role: findUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
