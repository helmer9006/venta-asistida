import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query, ParseUUIDPipe, UseGuards, SetMetadata } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { Request, Response } from 'express';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { EmailPipe } from '@src/shared/pipes/email.pipe';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { ApiTags } from '@nestjs/swagger';

import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import { Auth } from '@src/auth/decorators';

@Controller('users')
@ApiTags('Servicios Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async create(@Body() createUserDto: CreateUserDto, @GetUser('id') userId: number) {
    const data = await this.usersService.create(createUserDto, userId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario creado correctamente.');
  }
  @Get()
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async findAll(@Query() paginationDto: PaginationDto) {
    const data = await this.usersService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuarios encontrados');
  }

  @Get('/getByterm/:term')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async getByterm(@Param('term') term: string) {
    const data = await this.usersService.getByterm(term);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }

  @Patch('update/:id')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser('id') userId: number) {
    const data = await this.usersService.update(+id, updateUserDto, userId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario actualizado correctamente.');
  }

  @Get('/signin')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const url = await this.usersService.signIn(res)
    res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
  }

  @Get('/signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    const url = await this.usersService.signout()
    res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
  }

  @Get('/getByMail/:email')
  @Auth()
  async getById(@Param('email', EmailPipe) email: string) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }

  @Post('/getUserAndTokenByCode')
  async getToken(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.usersService.findUserAndTokenByCode(code, req, res)
    res.status(200).json({ data: data, statusCode: 200, message: 'Usuario identificado.' })
  }
}
