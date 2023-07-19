import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { AADStrategy } from './strategies/aad.strategy';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt', AADStrategy }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '8h' },
  }),],
  providers: [JwtStrategy, PrismaService, AADStrategy, AuthService],
  exports: [JwtStrategy, PassportModule, JwtModule, PrismaService],
  controllers: [AuthController]
})
export class AuthModule { }
