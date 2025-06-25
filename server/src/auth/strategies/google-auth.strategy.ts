import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // GoogleStrategy → ใช้กำหนดวิธี login ด้วย Google และกำหนด validate() ว่าจะคืน user แบบไหน
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['openid', 'profile', 'email'],
      // accessType: 'offline', // อย่าใส่ตรงนี้ ให้ไปใส่ที่ GoogleAuthGuard
      // prompt: 'consent', // อย่าใส่ตรงนี้ ให้ไปใส่ที่ GoogleAuthGuard
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: any) => void,
  ): void {
    axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        const data = res.data;
        const profile = {
          provider: 'google',
          id: data.sub,
          displayName: data.name,
          name: {
            givenName: data.given_name,
            familyName: data.family_name,
          },
          emails: [{ value: data.email }],
          photos: [{ value: data.picture }],
        };
        done(null, profile);
      })
      .catch((err) => done(err));
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails, displayName, photos, name } = profile;

    const givenName = name?.givenName ?? '';
    const familyName = name?.familyName ?? '';
    const email = emails?.[0]?.value ?? '';
    const picture = photos?.[0]?.value ?? '';

    const user = {
      googleId: id,
      email,
      name: `${givenName} ${familyName}`,
      displayName,
      picture,
      accessToken,
      refreshToken,
    };

    // console.log('[GoogleStrategy] accessToken:', accessToken);
    // console.log('[GoogleStrategy] refreshToken:', refreshToken);
    // console.log('[GoogleStrategy] req.query:', req.query);
    // console.log('[GoogleStrategy] profile:', JSON.stringify(profile, null, 2));

    await Promise.resolve();
    done(null, user);
  }
}
