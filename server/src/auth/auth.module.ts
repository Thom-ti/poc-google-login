import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google-auth.strategy';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    UserModule,
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, GoogleAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
