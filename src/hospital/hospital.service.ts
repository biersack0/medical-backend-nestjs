import { PaginationDto } from '@/common/dto/pagination.dto';
import { handleExceptions } from '@/common/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
  ) {}

  async create(id: string, createHospitalDto: CreateHospitalDto) {
    try {
      const hospitalCreated = await this.hospitalModel.create({
        user: id,
        ...createHospitalDto,
      });
      return hospitalCreated;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const total = await this.hospitalModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const hospitals = await this.hospitalModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('user', 'name image');

    return {
      total,
      'total-pages': totalPages,
      page,
      hospitals,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} hospital`;
  }

  update(id: string, updateHospitalDto: UpdateHospitalDto) {
    return `This action updates a #${id} hospital`;
  }

  remove(id: string) {
    return `This action removes a #${id} hospital`;
  }
}
