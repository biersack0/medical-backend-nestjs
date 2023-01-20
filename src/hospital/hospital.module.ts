import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { CommonModule } from '@/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './entities/hospital.entity';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [MongooseModule],
})
export class HospitalModule {}
