import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtPayload, TRequestUser } from 'src/shared/types';
import { EncryptionService } from 'src/shared/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async googleLogin(user: TRequestUser) {
    if (!user) {
      throw new Error('ไม่พบผู้ใช้งานนี้จาก Google');
    }

    const { googleId, email, name, picture, accessToken, refreshToken } = user;

    const encryptedRefreshToken = refreshToken
      ? this.encryptionService.encrypt(refreshToken)
      : null;

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
        ...(encryptedRefreshToken && { refreshToken: encryptedRefreshToken }),
      });
    } else if (encryptedRefreshToken) {
      findUser.refreshToken = encryptedRefreshToken;
    }

    await findUser.save();

    const payload: JwtPayload = {
      sub: findUser.googleId,
      email: findUser.email,
      name: findUser.name,
      image: findUser.picture,
      role: findUser.role,
    };

    return {
      jwt: this.jwtService.sign(payload, { expiresIn: '1h' }),
      accessToken,
      userInfo: {
        googleId,
        email,
        fullName: name,
        role,
        image: picture,
      },
    };
  }
}
