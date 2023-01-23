import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { MongoIdPipe } from '@/common/pipes/mongo-id/mongo-id.pipe';
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
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@UseGuards(JwtAuthGuard)
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post()
  create(
    @Headers('Authorization') auth: string,
    @Body() createDoctorDto: CreateDoctorDto,
  ) {
    const { id } = this.jwtUtil.decode(auth);
    return this.doctorService.create(id, createDoctorDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.doctorService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.doctorService.remove(id);
  }
}
