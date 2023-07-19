import { Controller, Get, Post, Body, Patch, Param, Req, Res, Delete, HttpStatus, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from '@src/auth/services/auth/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Services Authentication')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Post('/getUserAndTokenByCode')
    @ApiResponse({ status: 200, description: `Login exitoso.` })
    @ApiResponse({ status: 401, description: `No es posible validar la identidad del usuario, usuario inactivo o rol de usuario inactivo.` })
    async getToken(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
        const data = await this.authService.findUserAndTokenByCode(code, req, res)
        res.status(200).json({ data: data, statusCode: 200, message: 'Login exitoso.' })
    }

    @Get('/signin')
    @ApiResponse({ status: 200, description: `Login exitoso.` })
    @ApiResponse({ status: 500, description: `Error consultando url de login.` })
    async signIn(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signIn()
        res.status(200).json({ data: url, statusCode: 200, message: 'Exitosamente.' })
    }

    @Get('/signout')
    async signout(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signout()
        res.status(200).json({ data: url, statusCode: 200, message: 'Exitosamente' })
    }
}
