import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { User } from './entities/user.entity';
import { Utils } from '@/common/utils/utils';
import { CreategGoogleUserDto } from './dto/create-google-user.dto';
import { CreateException } from '@/common/exceptions/create.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = new Utils().encryptPassword(
      createUserDto.password,
    );

    try {
      const userCreated = await this.userModel.create(createUserDto);
      return userCreated;
    } catch (error) {
      throw new CreateException(error, 'El usuario');
    }
  }

  async createWithGoogle(creategGoogleUserDto: CreategGoogleUserDto) {
    creategGoogleUserDto.password = new Utils().encryptPassword(
      creategGoogleUserDto.password,
    );

    const userDB = await this.userModel.findOne({
      email: creategGoogleUserDto.email,
    });

    if (!userDB) {
      const userCreated = await this.userModel.create(creategGoogleUserDto);
      return userCreated;
    } else {
      userDB.hasGoogle = true;
      await userDB.save();
      return userDB;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const total = await this.userModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const users = await this.userModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    return {
      total,
      'total-pages': totalPages,
      page,
      users,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException(`Usuario no encontrado.`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = new Utils().encryptPassword(
        updateUserDto.password,
      );
    }

    try {
      await user.updateOne(updateUserDto);
      return {
        ...user.toJSON(),
        ...updateUserDto,
      };
    } catch (error) {
      throw new InternalServerErrorException('Hubo un error.');
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Usuario no encontrado.`);
    }

    return {};
  }
}
