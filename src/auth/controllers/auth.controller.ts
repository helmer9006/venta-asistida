import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Res,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '@src/auth/services/auth.service';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetTokenDto } from '@src/auth/models/dto/get-token.dto';
import { Users } from '@prisma/client';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { SW_RESPONSES } from '@src/shared/helpers/responses-swagger';

@Controller('auth')
@ApiTags('Services Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}
  @Post('/getUserAndTokenByCode')
  @ApiBody({ type: GetTokenDto })
  @ApiOkResponse(SW_RESPONSES.getUserAndTokenByCodeOkResponse)
  @ApiUnauthorizedResponse(SW_RESPONSES.getUserAndTokenByCodeUnauthorized)
  async getToken(
    @Body('code') code: GetTokenDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data = await this.authService.findUserAndTokenByCode(code, req, res);
    return res
      .status(200)
      .json({ data: data, statusCode: 200, message: 'Login exitoso.' });
  }

  @Get('/signin')
  @ApiOkResponse(SW_RESPONSES.getAuthOkReponse)
  @ApiInternalServerErrorResponse(SW_RESPONSES.errorServerResponse)
  async signIn(@Req() req: Request, @Res() res: Response) {
    const url = await this.authService.signIn();
    res.status(200).json({
      data: url,
      statusCode: 200,
      message: 'Url encontrada exitosamente.',
    });
  }

  @Get('/signout')
  @ApiOkResponse(SW_RESPONSES.getAuthOkReponse)
  async signout(@Req() req: Request, @Res() res: Response) {
    const url = await this.authService.signout();
    res.status(200).json({
      data: url,
      statusCode: 200,
      message: 'Url encontrada exitosamente',
    });
  }
}
