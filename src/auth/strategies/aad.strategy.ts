import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { UnauthorizedException } from '@src/shared/exceptions';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { IPayload } from '../models/payload.model';

@Injectable()
export class AADStrategy extends PassportStrategy(BearerStrategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            identityMetadata: process.env.IDENTITYMETADATA,
            clientID: process.env.APP_CLIENT_ID,
        })
    }

    async validate(payload: IPayload) {
        const { emails } = payload;
        if (emails.length == 0) {
            throw new UnauthorizedException('Usuario no identificado.');
        }
        const user = await this.prismaService.users.findUnique({ where: { email: emails[0] } })
        if (!user) {
            throw new UnauthorizedException('Token no es válido');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('Usuario se encuentra inactivo.');
        }
        return user;
    }
}