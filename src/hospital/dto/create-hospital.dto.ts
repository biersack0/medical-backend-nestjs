import { IsString, MinLength } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @MinLength(3)
  name: string;
}
