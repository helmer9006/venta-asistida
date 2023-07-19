import { Controller, Get, Post, Body, Patch, Param, Req, Res, Delete, HttpStatus, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from '@src/auth/services/auth/auth.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Post('/getUserAndTokenByCode')
    async getToken(@Body('code') code: string, @Req() req: Request, @Res() res: Response) {
        const data = await this.authService.findUserAndTokenByCode(code, req, res)
        res.status(200).json({ data: data, statusCode: 200, message: 'Usuario identificado.' })
    }

    @Get('/signin')
    async signIn(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signIn()
        res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
    }

    @Get('/signout')
    async signout(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signout()
        res.status(200).json({ data: url, statusCode: 200, message: 'Success' })
    }
}
