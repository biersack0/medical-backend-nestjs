import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginGoogleAuthDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.SHOULD_NOT_BE_EMPTY'),
  })
  token: string;
}
