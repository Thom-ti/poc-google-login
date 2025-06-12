import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// JwtAuthGuard→ เป็น AuthGuard('jwt')) ที่ใช้ passport-jwt
