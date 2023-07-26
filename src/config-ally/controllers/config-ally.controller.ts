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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Auth, Roles } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';

@Controller('config-ally')
@ApiTags('Services allies configuration')
export class ConfigAllyController {
  constructor(private readonly configAllyService: ConfigAllyService) {}

  @Post()
  @Auth(RolesEnum.ADMINISTRADOR, RolesEnum.SUPERADMINISTRADOR)
  @ApiBody({ type: CreateConfigAllyDto })
  async create(@Body() createConfigAllyDto: CreateConfigAllyDto) {
    const data = await this.configAllyService.create(createConfigAllyDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Configuracion creada correctamente.',
    );
  }

  @Get('/:idForm/:idAlly')
  @Auth(RolesEnum.ADMINISTRADOR, RolesEnum.SUPERADMINISTRADOR)
  async findOne(
    @Param('idForm') idFormBase: string,
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
  @Auth(RolesEnum.ADMINISTRADOR, RolesEnum.SUPERADMINISTRADOR)
  update(
    @Param('id') id: string,
    @Body() updateConfigAllyDto: UpdateConfigAllyDto,
  ) {
    return this.configAllyService.update(+id, updateConfigAllyDto);
  }
}
