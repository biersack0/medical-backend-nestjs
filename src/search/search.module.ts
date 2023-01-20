import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { DoctorModule } from '@/doctor/doctor.module';
import { HospitalModule } from '@/hospital/hospital.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [DoctorModule, HospitalModule, UserModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
