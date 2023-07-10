import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestLoggerInterceptor } from 'src/shared/interceptors/request-logger.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { GenericResponse } from 'src/shared/models/generic-response.model';
import { DummyService } from '../services/dummy.service';
import { UserRequest } from '../models/request/user-request.model';

@Controller('api/v1/dummy')
@ApiTags('Servicios Dummy')
@UseInterceptors(RequestLoggerInterceptor)
export class DummyController {
  constructor(private readonly dummyService: DummyService) { }

  @UseGuards(AuthGuard)
  @Get('/only-guard')
  @ApiOperation({
    description:
      'Api accesible por cualquier usuario logueado, no requiere rol en especifico',
  })
  getDummyWithAuthGuard() {
    return 'Hello from auth guard ';
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Get('/only-guard-mod')
  @ApiOperation({
    description: 'Api solo accesible para usuarios de rol admin',
  })
  getDummyWithAuthGuardModule() {
    return 'Hello from auth guard module with roles';
  }


  @Get('/service')
  @ApiOperation({ description: 'Api con un servicio inyectado' })
  getDummyFromServiceInjected() {
    return this.dummyService.dummyServiceExample();
  }

  @Get(':id')
  @ApiOperation({
    description: 'Api con parametros y query params',
  })
  @ApiQuery({
    name: 'param',
    example: 'Ejemplo de param y función dentro del servicio',
  })
  @ApiParam({ name: 'id', example: 'Ejemplo y función dentro del servicio' })
  getDummy(@Query('param') param: string, @Param('id') id: string) {
    return new GenericResponse({}, HttpStatus.OK.valueOf(), 'Success');
  }


  @ApiOperation({
    description: 'Api post para generar un usuario randon con validaciones',
  })
  @Post('user')
  async createUserDummy(@Body() user: UserRequest) {
    // const data = await this.dummyService.dummyPrismaService(user);
    // return new GenericResponse(data, HttpStatus.OK, 'Success');
    return new GenericResponse({}, HttpStatus.OK.valueOf(), 'Success');
  }

}
