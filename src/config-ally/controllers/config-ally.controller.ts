import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigAllyService } from '../services/config-ally.service';
import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('config-ally')
@ApiTags('Services allies configuration')
export class ConfigAllyController {
  constructor(private readonly configAllyService: ConfigAllyService) { }

  @Post()
  create(@Body() createConfigAllyDto: CreateConfigAllyDto) {
    return this.configAllyService.create(createConfigAllyDto);
  }

  @Get()
  findAll() {
    return this.configAllyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configAllyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigAllyDto: UpdateConfigAllyDto) {
    return this.configAllyService.update(+id, updateConfigAllyDto);
  }
}
