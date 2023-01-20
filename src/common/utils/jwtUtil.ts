import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JWTPayload {
  user: string;
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JWTUtil {
  constructor(private readonly jwtService: JwtService) {}

  decode(auth: string): JWTPayload {
    const jwt = auth.replace('Bearer ', '');
    return this.jwtService.decode(jwt, { json: true }) as JWTPayload;
  }
}
