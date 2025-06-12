import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // GoogleStrategy → ใช้กำหนดวิธี login ด้วย Google และกำหนด validate() ว่าจะคืน user แบบไหน
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_REDIRECT_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
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
    };

    await Promise.resolve();
    done(null, user);
  }
}
