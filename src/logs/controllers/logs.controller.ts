import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes } from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { CreateLogDto } from '../models/dto/create-log.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Auth, GetUser } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import { RequestGetLogsDto } from '../models/dto/request-get-logs.dto';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';
@Controller('logs')
@ApiTags('Services Logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) { }

  @Post('create')
  @ApiBody({ type: CreateLogDto })
  @ApiOkResponse(SW_RESPONSES.createLogsOkResponse)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async create(@Body() createLogDto: CreateLogDto) {
    const data = await this.logsService.create(createLogDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Log creado correctamente.');
  }

  @Post('/getLogs')
  @Auth()
  @ApiBody({ type: RequestGetLogsDto })
  @ApiOkResponse(SW_RESPONSES.getLogsUsersOkResponse)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async findLogsUser(@Body() getUsersLogsDto: RequestGetLogsDto, @GetUser('roleId') roleId: number) {
    const data = await this.logsService.findLogsUser(getUsersLogsDto, roleId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Logs encontrados.');
  }
}
