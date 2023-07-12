import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../models/dto/create-role.dto';
import { UpdateRoleDto } from '../models/dto/update-role.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { Roles } from '@src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/auth/guards/roles.guard';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import { AuthGuard } from 'src/shared/guards/auth.guard';
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

  @Get('/getPermissionsByRole/:idRol')
  async getPermissionsByRole(@Param('idRol') idRol: string) {
    const data = await this.rolesService.findPermissionsByRole(+idRol);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Permisos encontrados.');
  }
}
