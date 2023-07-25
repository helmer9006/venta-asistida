import { Injectable, Logger, HttpStatus, Inject } from '@nestjs/common';
import { CreateLogDto } from '../models/dto/create-log.dto';
import { UpdateLogDto } from '../models/dto/update-log.dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { RequestGetLogsDto } from '../models/dto/request-get-logs.dto';
import config from '@src/config/config';
import { ConfigType } from '@nestjs/config';
import { BadRequestException } from '../../shared/exceptions/bad_request.exception';
import { UtilsService } from '@src/shared/services/utils.service';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';

@Injectable()
export class LogsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly utilsService: UtilsService,
  ) { }
  logger = new Logger('LogsService');
  async create(createLogDto: CreateLogDto) {
    try {
      const logCreated = await this.prismaService.logs.create({ data: createLogDto })
      return logCreated;
    } catch (error) {
      // this.logger.error('Error creando log', error);
      return {}
      // throw new GenericResponse({}, HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error de servidor al crear log.');
    }
  }

  async findLogsUser(getUsersLogsDto: RequestGetLogsDto, roleId: number, paginationDto?: PaginationDto) {
    await this.utilsService.validatePermission('LOG001', roleId)
    const { limit = 10, offset = 1 } = paginationDto;
    const { model, modelId, startDate, endDate } = getUsersLogsDto;
    if (startDate > new Date() || endDate > new Date()) {
      throw new GenericResponse({}, HttpStatus.BAD_REQUEST.valueOf(), 'La fecha no puede ser mayor que la fecha actual.');
    }
    try {
      return await this.prismaService.logs.findMany({
        where: {
          model: model, modelId: modelId, createdAt: {
            gte: startDate,
            lte: endDate,
          }
        },
        include: { users: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (offset - 1) * limit,
      });
    } catch (error) {
      throw new GenericResponse({}, HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error de servidor al consultando logs.');
    }
  }

}
