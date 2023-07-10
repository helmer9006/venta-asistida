import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { Request, Response } from 'express'
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '../models/dto';
import { EmailPipe } from '@src/shared/pipes/email.pipe';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @Get('/getByIdOrName/:term')
  async getByIdOrName(@Param('term') term: string) {
    const data = await this.usersService.getByIdOrName(term);
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
    console.log("url")
    res.redirect(url);
    // res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
  }

  @Get('/signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    const url = await this.usersService.signout()
    res.redirect(url);
    // res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
  }

  @Get('getByMail/:email')
  async getById(@Param('email', EmailPipe) email: string) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(data, HttpStatus.OK.valueOf(), 'Success');
  }
  //TODO: crear servicio para consultar si el usuario está activo o no
}
