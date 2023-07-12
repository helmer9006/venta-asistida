import { HttpStatus } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { IAuditAction } from '../interfaces/audit-logs.interfaces';
import { NewAuditLogDto } from '../models/dto/userAuditLogDto';
import { GenericResponse } from '@src/shared/models/generic-response.model';

export class AuditLogs {
  constructor(private prismaService: PrismaService) { }

  async sendLogsDB(userId: number, data: object, typeAction: IAuditAction) {
    const log: NewAuditLogDto = {
      userId: userId,
      description: typeAction.description,
      typeAction: typeAction.action,
      data: JSON.stringify(data),
      createdAt: new Date(),
    };
    try {
      await this.prismaService.auditLogs.create({ data: log });

    } catch (error) {
      console.log(error);
      return new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        `Error al guardar el registro de auditoria. ${error}`,
      );
    }
    //await this.prismaService.userAuditLogs.create({data: log as Prisma.UserAuditLogsCreateInput})
  }
}
