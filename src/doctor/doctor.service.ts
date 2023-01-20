import { handleExceptions } from '@/common/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly hospitalModel: Model<Doctor>,
  ) {}

  async create(userId: string, createDoctorDto: CreateDoctorDto) {
    /* return {
      userId,
      data: createDoctorDto,
    }; */
    try {
      const hospitalCreated = await this.hospitalModel.create({
        user: userId,
        ...createDoctorDto,
      });
      return hospitalCreated;
    } catch (error) {
      handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all doctor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
