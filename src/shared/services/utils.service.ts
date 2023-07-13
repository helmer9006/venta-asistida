import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { NewAuditLogDto } from '../models/dto/userAuditLogDto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Logger } from '@azure/msal-node';
import { PrismaClient } from '@prisma/client';
import { IAuditAction } from '../interfaces/audit-logs.interfaces';

@Injectable()
export class UtilsService {
    constructor(private prismaService: PrismaService,) { }

    async validatePermission(code: string, roleId: number) {
        try {
            const permission = await this.prismaService.permissions.findMany({
                where: {
                    code: code
                },
                include: {
                    rolesPermission: {
                        where: {
                            roleId: roleId
                        },
                    }
                },
            });
            if (permission.length == 0)
                throw Error
            return;
        } catch (error) {
            throw new GenericResponse({}, 401, 'No tiene permisos necesario para acceder al recurso.')
        }
    }

    async saveLogs(userId: number, data: object, typeAction: IAuditAction) {
        const log: NewAuditLogDto = {
            userId: userId,
            description: typeAction.description,
            typeAction: typeAction.action,
            data: JSON.stringify(data),
            createdAt: new Date(),
        };
        try {
            await this.prismaService.logs.create({ data: log });
        } catch (error) {
            throw new InternalServerErrorException(`Error al guardar el registro de logs. ${error}`)
        }
    }
}