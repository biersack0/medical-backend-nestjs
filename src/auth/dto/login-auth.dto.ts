import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.SHOULD_NOT_BE_EMPTY', {
      property: 'El correo electrónico',
    }),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.MUST_BE_AN_EMAIL'),
    },
  )
  email: string;

  @IsString({
    message: i18nValidationMessage('validation.MUST_BE_A_PASSWORD'),
  })
  @MinLength(8, { message: i18nValidationMessage('validation.MIN_PASSWORD') })
  password: string;
}
