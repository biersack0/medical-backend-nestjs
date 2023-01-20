import { Hospital } from '@/hospital/entities/hospital.entity';
import { User } from '@/user/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false })
export class Doctor {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  })
  hospital: Hospital;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
