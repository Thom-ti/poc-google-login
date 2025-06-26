export interface UserEntity {
  id: string;
  role_id: string;
  googleId?: string;
  fullName: string;
  email: string;
  isActive: boolean;
  hasSentEmail: boolean;
  refreshTokenEncrypted?: string;
  created_at: Date;
  updated_at: Date;
}
