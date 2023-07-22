import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigAllyService } from './config-ally.service';
import { CreateConfigAllyDto } from './dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from './dto/update-config-ally.dto';

@Controller('config-ally')
export class ConfigAllyController {
  constructor(private readonly configAllyService: ConfigAllyService) {}

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
