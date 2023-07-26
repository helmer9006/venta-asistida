import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IPayload } from '../models/payload.model';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UnauthorizedException } from '@src/shared/exceptions';
import { Users } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(config.KEY) configService: ConfigType<typeof config>,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: IPayload): Promise<Users> {
    const { sub } = payload;
    if (!sub) {
      throw new UnauthorizedException('Usuario no identificado.');
    }
    const user = await this.prismaService.users.findUnique({
      where: { uid: sub },
    });
    if (!user) {
      throw new UnauthorizedException('Token no es válido');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario se encuentra inactivo.');
    }
    return user;
  }
}
