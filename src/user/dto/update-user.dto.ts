import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.MUST_BE_A_PASSWORD'),
  })
  @MinLength(8, { message: i18nValidationMessage('validation.MIN_PASSWORD') })
  password: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.MUST_BE_A_NAME'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.MIN', {
      property: 'El nombre',
    }),
  })
  name: string;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('validation.MUST_BE_A_BOOLEAN_VALUE'),
  })
  isActive?: boolean;
}
