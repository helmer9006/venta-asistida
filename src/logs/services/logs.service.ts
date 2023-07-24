import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreateLogDto } from '../models/dto/create-log.dto';
import { UpdateLogDto } from '../models/dto/update-log.dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';

@Injectable()
export class LogsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  logger = new Logger('LogsService');
  async create(createLogDto: CreateLogDto) {
    try {
      const logCreated = await this.prismaService.logs.create({ data: createLogDto })
      return logCreated;
    } catch (error) {
      this.logger.error('Error creando log', error);
      return {}
      // throw new GenericResponse({}, HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error de servidor al crear log.');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.logs.findMany({
        include: { users: true },
      });
    } catch (error) {
      throw new GenericResponse({}, HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error de servidor al consultando logs.');
    }
  }

}
