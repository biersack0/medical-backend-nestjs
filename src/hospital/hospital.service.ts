import { PaginationDto } from '@/common/dto/pagination.dto';
import { CreateException } from '@/common/exceptions/create.exception';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new CreateException(error, 'El hospital');
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

  async findOne(id: string) {
    const hospital = await this.hospitalModel.findById(id);

    if (!hospital) throw new NotFoundException(`Hospital no encontrado.`);
    return hospital;
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto) {
    const hospital = await this.findOne(id);

    try {
      await hospital.updateOne(updateHospitalDto);
      return {
        ...hospital.toJSON(),
        ...updateHospitalDto,
      };
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error.');
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.hospitalModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Hospital no encontrado.`);
    }

    return {};
  }
}
