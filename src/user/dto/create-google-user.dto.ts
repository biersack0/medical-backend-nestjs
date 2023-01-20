import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreategGoogleUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsBoolean()
  hasGoogle: boolean;
}
