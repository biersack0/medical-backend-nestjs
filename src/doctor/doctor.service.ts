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
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  async create(userId: string, createDoctorDto: CreateDoctorDto) {
    try {
      const doctorCreated = await this.doctorModel.create({
        user: userId,
        ...createDoctorDto,
      });
      return doctorCreated.populate('hospital', 'name image');
    } catch (error) {
      throw new CreateException(error, 'El doctor');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const total = await this.doctorModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const doctors = await this.doctorModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('user', 'name image')
      .populate('hospital', 'name image');

    return {
      total,
      'total-pages': totalPages,
      page,
      doctors,
    };
  }

  async findOne(id: string) {
    const doctor = await this.doctorModel.findById(id);

    if (!doctor) throw new NotFoundException(`Doctor no encontrado.`);
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.findOne(id);

    try {
      await doctor.updateOne(updateDoctorDto);
      return {
        ...doctor.toJSON(),
        ...updateDoctorDto,
      };
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error.');
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.doctorModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Doctor no encontrado.`);
    }

    return {};
  }
}
