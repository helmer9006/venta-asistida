import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse(SW_RESPONSES.createUserOkResponse)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.createUserUnauthorizeResponse)
  @ApiConflictResponse(SW_RESPONSES.conflictResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetUser('id') userId: number,
    @GetUser('roleId') roleId: number,
  ) {
    const data = await this.usersService.create(createUserDto, userId, roleId);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuario creado correctamente.',
    );
  }

  @Get()
  @ApiOkResponse(SW_RESPONSES.getUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser('id') userId: number,
  ) {
    const data = await this.usersService.findAll(paginationDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuarios encontrados',
    );
  }

  @Get('/getByterm/:term')
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiOkResponse(SW_RESPONSES.getTermUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async getByterm(
    @Param('term') term: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const data = await this.usersService.findByterm(term, paginationDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuario encontrado.',
    );
  }

  @Patch('update/:id')
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse(SW_RESPONSES.updateUserOkResponse)
  @ApiConflictResponse(SW_RESPONSES.userConflictResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestResponse)
  @ApiNotFoundResponse(SW_RESPONSES.updateUserNotFoundResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') userId: number,
  ) {
    const data = await this.usersService.update(+id, updateUserDto, userId);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuario actualizado correctamente.',
    );
  }

  @Get('/getByMail/:email')
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getMailUserOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  async getByEmail(
    @Param('email', EmailPipe) email: string,
    @GetUser('id') userId: number,
  ) {
    const data = await this.usersService.findByMail(email);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuario encontrado.',
    );
  }

  @Get('/getByRoleId/:roleId')
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getByRoleIdUserOkResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async getByRolId(
    @Param('roleId') roleId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const data = await this.usersService.findByRoleId(+roleId, paginationDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Usuario encontrado.',
    );
  }
}
