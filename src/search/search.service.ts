import { Doctor } from '@/doctor/entities/doctor.entity';
import { Hospital } from '@/hospital/entities/hospital.entity';
import { User } from '@/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(param: string) {
    const regex = new RegExp(param, 'i');

    const [doctors, hospitals, users] = await Promise.all([
      this.doctorModel.find({ name: regex }),
      this.hospitalModel.find({ name: regex }),
      this.userModel.find({ name: regex }),
    ]);

    return {
      doctors,
      hospitals,
      users,
    };
  }

  async findByCollection(collection: string, param) {
    const regex = new RegExp(param, 'i');
    let data = [];

    switch (collection) {
      case 'doctor':
        data = await this.doctorModel
          .find({ name: regex })
          .populate('user', 'name image')
          .populate('hospital', 'name image');
        break;
      case 'hospital':
        data = await this.hospitalModel
          .find({ name: regex })
          .populate('user', 'name image');
        break;
      case 'user':
        data = await this.userModel.find({ name: regex });
        break;
      default:
        throw new BadRequestException(
          `The collection must be a doctor, hospital or user.`,
        );
    }

    return data;
  }
}
