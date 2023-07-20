import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBody, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { EmailPipe } from '@src/shared/pipes/email.pipe';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { GetUser } from '@src/auth/decorators/get-user.decorator';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import { Auth } from '@src/auth/decorators';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';

@Controller('users')
@ApiTags('Services users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //#region POST /users/create
  @Post('create')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse(SW_RESPONSES.createUserOkResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.createUserUnauthorizeResponse)
  @ApiConflictResponse(SW_RESPONSES.userConflictResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async create(@Body() createUserDto: CreateUserDto, @GetUser('id') userId: number, @GetUser('roleId') roleId: number) {
    const data = await this.usersService.create(createUserDto, userId, roleId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario creado correctamente.');
  }
  //#endregion

  //#region GET /users
  @Get()
  @ApiOkResponse(SW_RESPONSES.getUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  async findAll(@Query() paginationDto: PaginationDto, @GetUser('id') userId: number) {
    const data = await this.usersService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuarios encontrados');
  }
  //#endregion

  //#region GET /users/getByterm/:term
  @Get('/getByterm/:term')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  @ApiOkResponse(SW_RESPONSES.getTermUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async getByterm(@Param('term') term: string, @GetUser('id') userId: number) {
    const data = await this.usersService.findByterm(term);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }
  //#endregion

  //#region PATCH /users/update/:id
  @Patch('update/:id')
  @Auth(RolesEnum.SUPERADMINISTRADOR, RolesEnum.ADMINISTRADOR)
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse(SW_RESPONSES.updateUserOkResponse)
  @ApiConflictResponse(SW_RESPONSES.userConflictResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiNotFoundResponse(SW_RESPONSES.updateUserNotFoundResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser('id') userId: number) {
    const data = await this.usersService.update(+id, updateUserDto, userId);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario actualizado correctamente.');
  }
  //#endregion

  //#region GET /users/getByMail/:email:
  @Get('/getByMail/:email')
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getMailUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async getById(@Param('email', EmailPipe) email: string, @GetUser('id') userId: number) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Usuario encontrado.');
  }
  //#endregion
}
