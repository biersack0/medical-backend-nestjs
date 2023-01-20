import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { JWTUtil } from '@/common/utils/JWTUtil';
import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Headers('Authorization') auth: string,
    @Body() createDoctorDto: CreateDoctorDto,
  ) {
    const { id } = this.jwtUtil.decode(auth);
    return this.doctorService.create(id, createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }
}
