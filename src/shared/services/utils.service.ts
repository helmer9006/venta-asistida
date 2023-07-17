import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { NewAuditLogDto } from '../models/dto/userAuditLogDto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PrismaClient } from '@prisma/client';
import { IAuditAction } from '../interfaces/audit-logs.interface';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '../adapters/axios.adapter';
import { IReponseTokenMule } from '../interfaces/response-token-mule.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class UtilsService {
    constructor(private prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly http: AxiosAdapter) { }
    logger = new Logger('UtilsService');
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

    async sendEmailMule(url: string, body: any, headers: object) {
        try {
            const token = await this.generateTokenMule();
            if (!token) {
                return {}
            }
            headers['Authorization'] = `Bearer ${token}`;
            const response = await this.http.post(url, body, headers)
            return response;
        } catch (error) {
            this.logger.error(`Error del servidor enviando correo a mule. Error ${JSON.stringify(error)}`)

        }
    }
    private async generateTokenMule() {
        const url = this.configService.get('MULE_URL_GENERATE_TOKEN');
        const headers = {
            'Client_id': this.configService.get('MULE_CLIENT_ID'),
            'Client_secret': this.configService.get('MULE_CLIENT_SECRET'),
            'grant_type': this.configService.get('MULE_GRANT_TYPE'),
        };
        try {
            const { access_token }: IReponseTokenMule = await this.http.post(url, {}, headers)
            if (!access_token) return '';
            return access_token;
        } catch (error) {
            this.logger.error(`Error al consultar token en mule. Error ${JSON.stringify(error)}`)
            return ''
        }

    }
}