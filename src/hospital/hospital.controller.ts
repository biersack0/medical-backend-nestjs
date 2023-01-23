import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { MongoIdPipe } from '@/common/pipes/mongo-id/mongo-id.pipe';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { JWTUtil } from '@/common/utils/JWTUtil';
import { PaginationDto } from '@/common/dto/pagination.dto';

@UseGuards(JwtAuthGuard)
@Controller('hospital')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post()
  create(
    @Headers('Authorization') auth: string,
    @Body() createHospitalDto: CreateHospitalDto,
  ) {
    const { id } = this.jwtUtil.decode(auth);
    return this.hospitalService.create(id, createHospitalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.hospitalService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.hospitalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    return this.hospitalService.update(id, updateHospitalDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.hospitalService.remove(id);
  }
}
