import { Utils } from '@/common/utils/utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginGoogleAuthDto } from './dto/login-google-auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private google: OAuth2Client;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.google = new OAuth2Client(
      configService.get('clientId'),
      configService.get('clientSecret'),
    );
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const userDB = await this.userModel.findOne({
      email: loginAuthDto.email,
    });

    if (!userDB)
      throw new NotFoundException(`User with email ${email} not found.`);

    const isSamePassword = await new Utils().isSamePassword(
      password,
      userDB.password,
    );

    if (!isSamePassword) throw new BadRequestException(`Password incorrect.`);

    // generate JWT
    const payload = { user: userDB.name, id: userDB._id };

    return { user: userDB, access_token: this.jwtService.sign(payload) };
  }

  async loginWithGoogle(loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;

    const userDB = await this.userModel.findOne({
      email,
    });

    // generate JWT
    const payload = { user: userDB.name, id: userDB._id };

    return { user: userDB, access_token: this.jwtService.sign(payload) };
  }

  async getProfileByToken(loginGoogleAuthDto: LoginGoogleAuthDto) {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: loginGoogleAuthDto.token,
        audience: this.configService.get('clientId'),
      });

      const data = ticket.getPayload();
      return data;
    } catch (error) {
      throw new BadRequestException('Google Token invalid.');
    }
  }

  async renewToken(id: string) {
    const userDB = await this.userModel.findOne({
      _id: id,
    });
    // generate JWT
    const payload = { user: userDB.name, id: userDB._id };
    return { user: userDB, access_token: this.jwtService.sign(payload) };
  }
}
