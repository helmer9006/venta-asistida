import { Injectable, HttpStatus, Logger, InternalServerErrorException, Inject, NotFoundException } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { ConfigService, ConfigType } from '@nestjs/config';
import { validate as IsUUID } from 'uuid';

import { CreateUserDto, RequestUserDto, UpdateUserDto } from '../models/dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConflictException, BadRequestException } from '@src/shared/exceptions';
import config from 'src/config/config';
import { isNumber } from '@src/shared/helpers/general';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { UtilsService } from '../../shared/services/utils.service';

const confidentialClientConfig = {
  auth: {
    clientId: process.env.APP_CLIENT_ID,
    authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY,
    clientSecret: process.env.APP_CLIENT_SECRET,
    knownAuthorities: [process.env.AUTHORITY_DOMAIN], //This must be an array
    redirectUri: process.env.APP_REDIRECT_URI,
    validateAuthority: false,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(
  confidentialClientConfig,
);

const authCodeRequest: any = {
  redirectUri: confidentialClientConfig.auth.redirectUri,
};

const tokenRequest: any = {
  redirectUri: confidentialClientConfig.auth.redirectUri,
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly utilService: UtilsService
  ) { }

  logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto, userId: number, roleId) {
    // await this.utilService.validatePermission('USER007', roleId)
    const auditAction = this.configuration.auditActions.user_create;
    try {
      createUserDto.email = createUserDto.email.toLowerCase().trim();
      createUserDto.name = createUserDto.name.toLowerCase().trim();
      createUserDto.lastname = createUserDto.lastname.toLowerCase().trim();
      await this.prismaService.users.create({ data: createUserDto })
      // TODO: ENVIAR EMAIL POR MULE A USUARIO SEGUN CORREO.
      await this.utilService.saveLogs(userId, createUserDto, auditAction)
      return this.prismaService.users.findMany();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.prismaService.users.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      return new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error del servidor.',
      );
    }
  }

  async findByterm(term: string) {
    let where;
    where = isNumber(term.trim()) ? { id: Number(term) } : IsUUID(term) ? { uid: term.toString().trim().toLowerCase() } : {
      name: {
        contains: term,
        mode: 'insensitive',
      }
    };
    try {
      return await this.prismaService.users.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      return new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error del servidor.',
      );
    }
  }

  async findByMail(email: string) {
    let user;
    try {
      user = await this.prismaService.users.findUnique({
        where: {
          email: email.toString().trim().toLowerCase(),
        },
      });
    } catch (error) {
      return new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error del servidor.',
      );
    }
    if (!user) {
      throw new NotFoundException({
        title: 'Usuario no encontrado.',
        status: 404,
        error: 'Usuario no encontrado.',
        details: 'Usuario no encontrado.',
      });
    }
    return user;
  }

  async findUserAndTokenByCode(code: string, req, res) {
    tokenRequest.code = code;
    let userUid, email, idTokenClaims, token;

    try {
      let response: any = await confidentialClientApplication.acquireTokenByCode(tokenRequest)
      userUid = response?.idTokenClaims?.sub || null;
      email = response?.idTokenClaims?.emails[0] || null;
      token = response?.idToken || null;
      idTokenClaims = response?.idTokenClaims || null;

    } catch (error) {
      res.status(401).json({ data: {}, statusCode: 401, message: 'No es posible validar la identidad del usuario.' })
    }

    if (!userUid) {
      throw new NotFoundException({
        title: 'No existe id de usuario.',
        status: 404,
        error: 'No éxiste id de usuario.',
        details: 'No éxiste id de usuario.'
      })
    }
    if (!email) {
      throw new NotFoundException({
        title: 'No es posible validar la identidad del usuario.',
        status: 401,
        error: 'No es posible validar la identidad del usuario.',
        details: 'No es posible validar la identidad del usuario.'
      })
    }
    const user = await this.prismaService.users.findUnique({
      where: { email }
    });
    if (!user) {
      throw new NotFoundException({
        title: 'El usuario no se encuentra registrado.',
        status: 401,
        error: 'El usuario no existe.',
        details: 'El usuario no existe.'
      })
    }

    if (!user?.uid) {
      await this.prismaService.users.update({
        where: {
          id: user.id,
        }, data: { uid: userUid }
      })
    }
    return { user, token, idTokenClaims }
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const auditAction = this.configuration.auditActions.user_update;
    try {
      if (updateUserDto.email) updateUserDto.email = updateUserDto.email.toLowerCase().trim();
      if (updateUserDto.name) updateUserDto.name = updateUserDto.name.toLowerCase().trim();
      if (updateUserDto.lastname) updateUserDto.lastname = updateUserDto.lastname.toLowerCase().trim();

      const updatedUser = await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: updateUserDto,
      });
      if (!updatedUser) {
        throw new NotFoundException({
          title: 'Usuario no actualizado.',
          status: 404,
          error: 'Usuario no actualizado.',
          details: 'Usuario no actualizado..',
        });
      }
      await this.utilService.saveLogs(userId, updateUserDto, auditAction);
      return updatedUser;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: error.detail,
        error: 'Error creando usuario',
        title: 'Error creando usuario',
      });
    }

    if (error.code === 'P2002') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: `Ya existe un registro duplicado por el campo ${error.meta.target[0]}`,
        error: 'Error creando usuario, el usuario ya se encuentra registrado.',
        title: 'El usuario ya se encuentra registrado.',
      });
    }
    throw new BadRequestException(
      'Error inesperado, revise los logs del servidor.',
    );
  }

  async getAuthCode(authority, scopes, state) {
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;
    tokenRequest.authority = authority;
    try {
      return await confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
    } catch (error) {
      throw new InternalServerErrorException('Error consultando url login.')
    }
  }

  signIn() {
    const url = this.getAuthCode(this.configService.get('SIGN_UP_SIGN_IN_POLICY_AUTHORITY'), [], this.configuration.APP_B2C_STATES.LOGIN);
    return url
  }

  signout() {
    return this.configService.get('LOGOUT_ENDPOINT');
  }
}
