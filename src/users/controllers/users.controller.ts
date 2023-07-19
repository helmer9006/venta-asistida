import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { EmailPipe } from '@src/shared/pipes/email.pipe';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import { Auth } from '@src/auth/decorators';

@Controller('users')
@ApiTags('Services users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async create(@Body() createUserDto: CreateUserDto, @GetUser('id') userId: number, @GetUser('roleId') roleId: number) {
    const data = await this.usersService.create(createUserDto, userId, roleId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario creado correctamente.');
  }
  @Get()
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async findAll(@Query() paginationDto: PaginationDto, @GetUser('id') userId: number) {
    const data = await this.usersService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuarios encontrados');
  }

  @Get('/getByterm/:term')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async getByterm(@Param('term') term: string, @GetUser('id') userId: number) {
    const data = await this.usersService.findByterm(term);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }

  @Patch('update/:id')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser('id') userId: number) {
    const data = await this.usersService.update(+id, updateUserDto, userId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario actualizado correctamente.');
  }

  @Get('/getByMail/:email')
  @Auth()
  async getById(@Param('email', EmailPipe) email: string, @GetUser('id') userId: number) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }
}
