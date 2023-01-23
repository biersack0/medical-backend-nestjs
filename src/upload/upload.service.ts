import { Doctor } from '@/doctor/entities/doctor.entity';
import { Hospital } from '@/hospital/entities/hospital.entity';
import { User } from '@/user/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import * as fs from 'fs';
import { Model } from 'mongoose';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async uploadImage(collection: string, id: string, file: Express.Multer.File) {
    const deleteImageIfInvalidID = () => {
      const currentPathImage = `./${file.path}`;

      fs.unlink(currentPathImage, (err) => {
        if (err)
          throw new BadRequestException('Hay un problema con la imagen.');
      });
    };

    const deleteImageIfExists = (collection: string, image: string) => {
      if (image) {
        const currentPathToDelete = `./public/uploads/${collection}/${image}`;

        fs.unlink(currentPathToDelete, (err) => {
          if (err)
            throw new BadRequestException('Hay un problema con la imagen.');
        });
      }
    };

    if (!isMongoId(id)) {
      deleteImageIfInvalidID();
      throw new BadRequestException(`${id} no es un mongo id válido.`);
    }

    switch (collection) {
      case 'user':
        const user = await this.userModel.findById(id);

        if (!user) {
          deleteImageIfInvalidID();
          throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
        }

        deleteImageIfExists(collection, user.image);
        user.image = file.filename;
        user.save();
        return user;

      case 'hospital':
        const hospital = await this.hospitalModel.findById(id);
        if (!hospital) {
          deleteImageIfInvalidID();
          throw new NotFoundException(`Hospital con id ${id} no encontrado.`);
        }

        deleteImageIfExists(collection, hospital.image);
        hospital.image = file.filename;
        hospital.save();
        return hospital;

      case 'doctor':
        const doctor = await this.doctorModel.findById(id);
        if (!doctor) {
          deleteImageIfInvalidID();
          throw new NotFoundException(`Doctor con id ${id} no encontrado.`);
        }

        deleteImageIfExists(collection, doctor.image);
        doctor.image = file.filename;
        doctor.save();
        return doctor;

      default:
        throw new BadRequestException(`Colección no encontrada.`);
    }
  }
}
