import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Auth } from '@src/auth/decorators';
import { RolesEnum } from '@src/auth/enums/roles.enum';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';

@Controller('permissions')
@ApiTags('Services permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getPermissionsOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  async findAll() {
    const data = await this.permissionsService.findAll();
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Permisos encontrados.',
    );
  }

  @Get('/getPermissionsByRole/:idRol')
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getByRolPermissionsOkResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  async getPermissionsByRole(@Param('idRol') idRol: string) {
    const data = await this.permissionsService.findPermissionsByRole(+idRol);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Permisos encontrados.',
    );
  }
}
