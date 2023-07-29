import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ConfigAllyService } from '../services/config-ally.service';
import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Auth, Roles } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';

@Controller('config-ally')
@ApiTags('Services allies configuration')
export class ConfigAllyController {
  constructor(private readonly configAllyService: ConfigAllyService) {}

  @Post()
  // @Auth(RolesEnum.ADMIN, RolesEnum.SUPERADMIN)
  @ApiBody({ type: CreateConfigAllyDto })
  @ApiCreatedResponse(SW_RESPONSES.createConfigAllyOkResponse)
  @ApiNotFoundResponse(SW_RESPONSES.notFoundAllyConfigAlly)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiBadRequestResponse(SW_RESPONSES.conflictResponseConfigAlly)
  async create(@Body() createConfigAllyDto: CreateConfigAllyDto) {
    const data = await this.configAllyService.create(createConfigAllyDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Configuracion creada correctamente.',
    );
  }

  @Get('/:idFormBase/:idAlly')
  @ApiNotFoundResponse(SW_RESPONSES.notFoundUrlGetConfigAlly)
  @ApiOkResponse(SW_RESPONSES.findFormBaseConfigAlly)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @Auth(RolesEnum.ADMIN, RolesEnum.SUPERADMIN)
  async findOne(
    @Param('idFormBase') idFormBase: string,
    @Param('idAlly') idAlly: string,
  ) {
    const data = await this.configAllyService.findOne(+idFormBase, +idAlly);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Configuracion encontrada.',
    );
  }

  @Patch(':id')
  // @Auth(RolesEnum.ADMIN, RolesEnum.SUPERADMIN)
  @ApiOkResponse(SW_RESPONSES.updateConfigAllyOkResponse)
  @ApiNotFoundResponse(SW_RESPONSES.notFoundAllyConfigAlly)
  @ApiConflictResponse(SW_RESPONSES.conflictResponseConfigAlly)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestUpdateConfigAlly)
  @ApiConflictResponse(SW_RESPONSES.badRequestFindConfigAlly)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async update(
    @Param('id') id: string,
    @Body() updateConfigAllyDto: UpdateConfigAllyDto,
  ) {
    const data = await this.configAllyService.update(+id, updateConfigAllyDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Configuracion actualizada correctamente.',
    );
  }
}
