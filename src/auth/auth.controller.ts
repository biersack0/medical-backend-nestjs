import { JWTUtil } from '@/common/utils/JWTUtil';
import { CreategGoogleUserDto } from '@/user/dto/create-google-user.dto';
import { UserService } from '@/user/user.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginGoogleAuthDto } from './dto/login-google-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private readonly jwtUtil: JWTUtil,
  ) {}

  @Post()
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/google')
  async loginGoogle(@Body() loginGoogleAuthDto: LoginGoogleAuthDto) {
    const { email, name, picture } = await this.authService.getProfileByToken(
      loginGoogleAuthDto,
    );

    const creategGoogleUserDto: CreategGoogleUserDto = {
      email,
      password: '@@',
      name,
      image: picture,
      hasGoogle: true,
    };

    const user = await this.userService.createWithGoogle(creategGoogleUserDto);

    const loginAuthDto: LoginAuthDto = {
      email: user.email,
      password: user.password,
    };

    return this.authService.loginWithGoogle(loginAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/renew')
  renew(@Headers('Authorization') auth: string) {
    const { id } = this.jwtUtil.decode(auth);
    return this.authService.renewToken(id);
  }
}
