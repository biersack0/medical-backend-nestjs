import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const handleExceptions = (error: any) => {
  if (error.code === 11000)
    throw new BadRequestException(`User exists in database.`);

  throw new InternalServerErrorException(`Can't create user.`);
};
