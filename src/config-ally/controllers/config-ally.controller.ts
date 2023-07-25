import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ConfigAllyService } from '../services/config-ally.service';
import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import { ApiTags } from '@nestjs/swagger';
import { GenericResponse } from '@src/shared/models/generic-response.model';

@Controller('config-ally')
@ApiTags('Services allies configuration')
export class ConfigAllyController {
  constructor(private readonly configAllyService: ConfigAllyService) { }

  @Post()
  create(@Body() createConfigAllyDto: CreateConfigAllyDto) {
    return this.configAllyService.create(createConfigAllyDto);
  }

  // @Get()
  // findAll() {
  //   const data = this.configAllyService.findAll();
  //   return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Configuraciones encontradas');
  // }

  @Get('/:idForm/:idAlly')
  async findOne(@Param('idForm') idFormBase: string, @Param('idAlly') idAlly: string) {
    const data = await this.configAllyService.findOne(+idFormBase, +idAlly);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Configuracion encontrada.');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigAllyDto: UpdateConfigAllyDto) {
    return this.configAllyService.update(+id, updateConfigAllyDto);
  }
}
