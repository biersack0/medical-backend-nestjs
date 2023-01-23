import { IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateHospitalDto {
  @IsString({
    message: i18nValidationMessage('validation.MUST_BE_A_NAME'),
  })
  @MinLength(3, {
    message: i18nValidationMessage('validation.MIN', {
      property: 'El nombre',
    }),
  })
  name: string;
}
