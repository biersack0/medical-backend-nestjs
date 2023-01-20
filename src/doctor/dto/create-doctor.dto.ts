import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsMongoId()
  hospital: string;
}
