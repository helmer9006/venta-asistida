import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../models/dto/create-role.dto';
import { UpdateRoleDto } from '../models/dto/update-role.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { Auth, GetUser } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';
@Controller('roles')
@ApiTags('Services roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post('create')
  @Auth(RolesEnum.SUPERADMINISTRADOR)
  async create(@Body() createRoleDto: CreateRoleDto, @GetUser('id') userId: number) {
    const data = await this.rolesService.create(createRoleDto, userId)
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Rol creado correctamente.');
  }

  @Get()
  @Auth(RolesEnum.SUPERADMINISTRADOR)
  async findAll(@Query() paginationDto: PaginationDto) {
    const data = await this.rolesService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Roles encontrados.');
  }

  @Patch(':id')
  @Auth(RolesEnum.SUPERADMINISTRADOR)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @GetUser('id') userId: number) {
    const data = await this.rolesService.update(+id, updateRoleDto, userId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Rol actualizado correctamente.');
  }

  @Get('/getModulesByRole/:idRol')
  @Auth()
  async getPermissionsByRole(@Param('idRol') idRol: string) {
    const data = await this.rolesService.findModulesByRole(+idRol);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Modulos encontrados.');
  }

}
