import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { CreateLogDto } from '../models/dto/create-log.dto';
import { UpdateLogDto } from '../models/dto/update-log.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Auth } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) { }

  @Post()
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async create(@Body() createLogDto: CreateLogDto) {
    const data = await this.logsService.create(createLogDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Log creado correctamente.');
  }

  @Get()
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  findAll() {
    return this.logsService.findAll();
  }
}
