import { IsMongoId, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDoctorDto {
  @IsString({
    message: i18nValidationMessage('validation.MUST_BE_A_NAME'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.MIN', {
      property: 'El nombre',
    }),
  })
  name: string;

  @IsMongoId({
    message: i18nValidationMessage('validation.MUST_BE_A_MONGODB_ID'),
  })
  hospital: string;
}
