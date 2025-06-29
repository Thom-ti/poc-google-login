import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop() // เพิ่ม googleId เข้ามา
  googleId: string;

  @Prop()
  picture: string;

  @Prop()
  role: string;

  @Prop({ required: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
