import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { Request, Response } from 'express';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { EmailPipe } from '@src/shared/pipes/email.pipe';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const data = await this.usersService.findAll(paginationDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
  }

  @Get('/getByterm/:term')
  async getByterm(@Param('term') term: string) {
    const data = await this.usersService.getByterm(term);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
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
  async getById(@Param('email', EmailPipe) email: string) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
  }

  @Post('/getUserAndTokenByCode')
  async getToken(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.usersService.findUserAndTokenByCode(code, req, res)
    res.status(200).json({ data: data, statusCode: 200, message: 'Success' })
  }
}
