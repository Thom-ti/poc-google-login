import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export type JwtPayload = { sub: string; email: string; name: string };

const cookieExtractor = (
  req: Request & { cookies?: Record<string, string> },
): string | null => {
  return req?.cookies?.jwt || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    await Promise.resolve();
    // This payload will be the decrypted token payload you provided when signing the token
    return { userId: payload.sub, email: payload.email, name: payload.name };
    // return payload;
  }
}
