import { Controller, Get, Post, Body, Patch, Param, Req, Res, Delete, HttpStatus, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from '@src/auth/services/auth.service';
import { ApiBody, ApiResponse, ApiTags, ApiOkResponse, ApiOperation, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { GetTokenDto } from '@src/auth/models/dto/get-token.dto';
import { Users } from '@prisma/client';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';

@Controller('auth')
@ApiTags('Services Authentication')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) { }
    @Post('/getUserAndTokenByCode')
    @ApiBody({ type: GetTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object', example: {
                                "user": {
                                    "id": 15,
                                    "uid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                    "name": "jose",
                                    "lastname": "pirela",
                                    "identificationType": "CC",
                                    "identification": "1051635343",
                                    "email": "helmer90@outlook.com",
                                    "address": "barrancabermeja",
                                    "phone": "3013555186",
                                    "isActive": true,
                                    "roleId": 2,
                                    "createdAt": "2023-07-10T01:55:20.176Z",
                                    "updatedAt": "2023-07-14T00:12:00.708Z",
                                    "roles": {
                                        "id": 2,
                                        "name": "superadministrador",
                                        "description": "test",
                                        "isActive": true,
                                        "createdAt": "2023-07-05T23:44:41.402Z",
                                        "updatedAt": "2023-07-17T22:03:54.774Z"
                                    }
                                },
                                "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2Z1bmRhY2lvbmdydXBvc29jaWFsMWIyY3BvYy5iMmNsb2dpbi5jb20vMzJmYjc5YWQtYzdmOS00YzMwLThjYTMtMDViNzU2NTdkZGYxL3YyLjAvIiwic3ViIjoiNGJlYzdjODMtNzlhMy00MWExLWI3NjEtODRhNzM3NTY3NzA4IiwiYXVkIjoiOTg5MzM5MjktYWU2ZC00ZGI4LWFjYmYtNDIxNjVjNGQyYzNjIiwiZXhwIjoxNjg5NzY3NDI3LCJpYXQiOjE2ODk3Mzg2MjcsImF1dGhfdGltZSI6MTY4OTczODE4NSwib2lkIjoiNGJlYzdjODMtNzlhMy00MWExLWI3NjEtODRhNzM3NTY3NzA4IiwiZW1haWxzIjpbImhlbG1lcjkwQG91dGxvb2suY29tIl0sInRmcCI6IkIyQ18xX3NhbGVzLXNpZ25pbi1zaWdudXAiLCJuYmYiOjE2ODk3Mzg2Mjd9.iTLAMio4vd5EY2z0-RImvwcTdpDDJdhsKfqsev98SBJsEa1Y8pM3ewdechsrWtzd49O4gtY6Al0Qez_muspcREF6fnAQzS-6RhHtLhNrnFlg4okZ9E-9TRtDY1t_kr2LKm43xvpPTS-lfSqw6ojL4h_-BW4Wf30s8ycE2_KSQh8ACjd-BgZ4f7LYuVdH1dGfEJnwEXVgyVSuU0sJUEzLHsEbfaZT_W8knFFbHYCyY_hWnOsVMAbKsdDCF_LoOcExnWsGXTXMtAxV9iMKh2HRqxF7pTOKk31qkn2WKDwbwPPqo0Gn20cMmQAnbjkFl34D7S1f8wDOqfKkBecMXEadGw",
                                "idTokenClaims": {
                                    "ver": "1.0",
                                    "iss": "https://fundaciongruposocial1b2cpoc.b2clogin.com/32fb79ad-c7f9-4c30-8ca3-05b75657ddf1/v2.0/",
                                    "sub": "4bec7c83-79a3-41a1-b761-84a737567708",
                                    "aud": "98933929-ae6d-4db8-acbf-42165c4d2c3c",
                                    "exp": 1689767427,
                                    "iat": 1689738627,
                                    "auth_time": 1689738185,
                                    "oid": "4bec7c83-79a3-41a1-b761-84a737567708",
                                    "emails": [
                                        "helmer90@outlook.com"
                                    ],
                                    "tfp": "B2C_1_sales-signin-signup",
                                    "nbf": 1689738627
                                },
                                "modules": [
                                    {
                                        "id": 1,
                                        "name": "administración",
                                        "createdAt": "2023-07-05T23:47:42.603Z",
                                        "updatedAt": "2023-07-05T23:00:00.000Z",
                                        "permissions": [
                                            {
                                                "id": 1,
                                                "description": "Crear usuario",
                                                "path": "/users/create",
                                                "createdAt": "2023-07-05T22:36:45.559Z",
                                                "updatedAt": "2023-07-05T22:36:00.000Z",
                                                "code": "USER001",
                                                "moduleId": 1,
                                                "isActive": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Login exitoso.' },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Error al validar autenticación del usuario en B2C',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', example: {} },
                        statusCode: { type: 'number', example: 401 },
                        message: { type: 'string', example: 'No es posible validar la identidad del usuario, usuario inactivo o rol de usuario inactivo.' },
                    },
                },
            },
        },
    })
    async getToken(@Body('code') code: GetTokenDto, @Req() req: Request, @Res() res: Response) {
        const data = await this.authService.findUserAndTokenByCode(code, req, res)
        return res.status(200).json({ data: data, statusCode: 200, message: 'Login exitoso.' })
    }

    @Get('/signin')
    @ApiOkResponse({
        description: `Url encontrada exitosamente.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'string', example: "https://fundaciongruposocial1b2cpoc.b2clogin.com/fundaciongruposocial1b2cpoc.onmicrosoft.com/b2c_1_sales-signin-signup/oauth2/v2.0/authorize?client_id=98933929-ae6d-4db8-acbf-42165c4d2c3c&scope=openid%20profile%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fadmin%2F&client-request-id=1d8a3ffa-90b8-41eb-bc3d-c74648e2960d&response_mode=query&response_type=code&x-client-SKU=msal.js.node&x-client-VER=1.18.0&x-client-OS=win32&x-client-CPU=x64&client_info=1&state=login" },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Url encontrada exitosamente.' },
                    },
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: 'Error consultando url de login.', content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object', example: {}
                        },
                        statusCode: { type: 'number', example: 500 },
                        message: { type: 'string', example: 'Error consultando url de login.' },
                    },
                },
            },
        },
    })
    async signIn(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signIn()
        res.status(200).json({ data: url, statusCode: 200, message: 'Url encontrada exitosamente.' })
    }

    @Get('/signout')
    @ApiOkResponse({
        description: `Url encontrada exitosamente.`, content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'string', example: "https://fundaciongruposocial1B2Cpoc.b2clogin.com/fundaciongruposocial1B2Cpoc.onmicrosoft.com/B2C_1_sales-signin-signup/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000" },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Url encontrada exitosamente.' },
                    },
                },
            },
        },
    })
    async signout(@Req() req: Request, @Res() res: Response) {
        const url = await this.authService.signout()
        res.status(200).json({ data: url, statusCode: 200, message: 'Url encontrada exitosamente' })
    }
}
