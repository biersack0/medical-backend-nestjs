import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CommonModule } from '@/common/common.module';
import { UserModule } from '@/user/user.module';
import { HospitalModule } from '@/hospital/hospital.module';
import { DoctorModule } from '@/doctor/doctor.module';

@Module({
  imports: [CommonModule, DoctorModule, HospitalModule, UserModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
