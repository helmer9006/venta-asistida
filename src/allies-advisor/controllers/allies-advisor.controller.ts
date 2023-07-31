import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { RolesEnum } from '@src/auth/enums/roles.enum';
import { Auth } from '@src/auth/decorators';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';
import { AlliesAdvisorService } from '../services/allies-advisor.service';
import { CreateAlliesAdvisorDto } from '../models/dto/create-allies-advisor.dto';
import { GenericResponse } from '@src/shared/models/generic-response.model';
@ApiTags('Services Allies Advisor')
@Controller('allies-advisor')
@ApiBearerAuth()
export class AlliesAdvisorController {
  constructor(private readonly alliesAdvisorService: AlliesAdvisorService) {}

  @Post('/create')
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiBody({ type: CreateAlliesAdvisorDto })
  @ApiOkResponse(SW_RESPONSES.createAlliesAdvisorOkResponse)
  @ApiBadRequestResponse(SW_RESPONSES.badRequestResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiConflictResponse(SW_RESPONSES.conflictRoleResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async create(@Body() createAlliesAdvisorDto: CreateAlliesAdvisorDto[]) {
    const data = await this.alliesAdvisorService.create(createAlliesAdvisorDto);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Registro creado correctamente.',
    );
  }

  @Get('/:advisorId')
  @Auth()
  @ApiOkResponse(SW_RESPONSES.getAlliesAdvisorOkReponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async findAll(@Param('advisorId') advisorId: string) {
    const data = await this.alliesAdvisorService.findAll(+advisorId);
    return new GenericResponse(
      data,
      HttpStatus.OK.valueOf(),
      'Registros encontrados.',
    );
  }

  @Delete(':id')
  @Auth(RolesEnum.SUPERADMIN, RolesEnum.ADMIN)
  @ApiOkResponse(SW_RESPONSES.deleteOkReponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.unauthorizeResponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async remove(@Param('id') id: string) {
    await this.alliesAdvisorService.remove(+id);
    return new GenericResponse(
      {},
      HttpStatus.OK.valueOf(),
      'Registro eliminado correctamente.',
    );
  }
}
