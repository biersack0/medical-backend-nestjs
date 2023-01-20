import { IsNotEmpty } from 'class-validator';

export class LoginGoogleAuthDto {
  @IsNotEmpty()
  token: string;
}
