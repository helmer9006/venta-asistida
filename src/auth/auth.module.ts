import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { AADStrategy } from './strategies/aad.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt', AADStrategy }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '8h' },
    // publicKey: ""
  }),],
  providers: [JwtStrategy, PrismaService, AADStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
