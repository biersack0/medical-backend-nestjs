import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String, required: true, default: 'USER_ROLE' })
  role: string;

  @Prop({ type: Boolean, default: false })
  hasGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
