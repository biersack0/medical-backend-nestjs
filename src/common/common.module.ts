import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTUtil } from './utils/JWTUtil';

@Module({
  providers: [JWTUtil, JwtService],
  exports: [JWTUtil],
})
export class CommonModule {}
