import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { UnauthorizedException } from '@src/shared/exceptions';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { IPayload } from '../models/payload.model';
import { Users } from '@prisma/client';

@Injectable()
export class AADStrategy extends PassportStrategy(BearerStrategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            identityMetadata: process.env.IDENTITY_METADATA,
            clientID: process.env.APP_CLIENT_ID,
        })
    }

    async validate(payload: IPayload) {
        const { sub } = payload;
        if (!sub) {
            throw new UnauthorizedException('Usuario no identificado.');
        }
        const user = await this.prismaService.users.findUnique({
            where: { uid: sub },
            include: {
                roles: true
            }
        })
        if (!user) {
            throw new UnauthorizedException('Token no es válido');
        }
        // const rolStatus: boolean = user.roles?.isActive || false;
        // if (!rolStatus) {
        //     throw new UnauthorizedException('El rol asignado al usuario se encuentra inactivo.');
        // }
        // if (!user.isActive) {
        //     throw new UnauthorizedException('Usuario se encuentra inactivo.');
        // }
        return user;
    }
}