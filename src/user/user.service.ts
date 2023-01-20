import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { User } from './entities/user.entity';
import { handleExceptions } from '@/common/exceptions';
import { Utils } from '@/common/utils/utils';
import { CreategGoogleUserDto } from './dto/create-google-user.dto';

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
      handleExceptions(error);
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

    if (!user) throw new NotFoundException(`User with id not found.`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    try {
      await user.updateOne(updateUserDto);
      return {
        ...user.toJSON(),
        ...updateUserDto,
      };
    } catch (error) {
      handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`User with id ${id} does not exist.`);
    }

    return `User was deleted successfully.`;
  }
}
