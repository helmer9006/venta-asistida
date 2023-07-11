import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../models/dto/create-role.dto';
import { UpdateRoleDto } from '../models/dto/update-role.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto)
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Rol creado correctamente.');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const data = await this.rolesService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Roles encontrados.');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.rolesService.update(+id, updateRoleDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Rol actualizado correctamente.');
  }

}
