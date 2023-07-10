import { Injectable, HttpStatus, Logger, InternalServerErrorException, Inject, NotFoundException } from '@nestjs/common';
import { CreateUserDto, PaginationDto, RequestUserDto, UpdateUserDto } from '../models/dto';
import { Users } from '@prisma/client';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConflictException, BadRequestException } from '@src/shared/exceptions';
import * as msal from '@azure/msal-node';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { isNumber } from '@src/shared/helpers/general';
import { Type } from 'class-transformer';
import { GenericResponse } from '@src/shared/models/generic-response.model';

const confidentialClientConfig = {
  auth: {
    clientId: process.env.APP_CLIENT_ID,
    authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY,
    clientSecret: process.env.APP_CLIENT_SECRET,
    knownAuthorities: [process.env.AUTHORITY_DOMAIN], //This must be an array
    redirectUri: process.env.APP_REDIRECT_URI,
    validateAuthority: false
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    }
  }
};

// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);

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

  ) {
  }

  logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.users.create({ data: createUserDto })
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
      });
    } catch (error) {
      return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error del servidor.');
    }
  }

  async getByIdOrName(term: string) {
    let where;
    where = isNumber(term) ? { id: Number(term) } : {
      name: {
        contains: term,
        mode: 'insensitive',
      }
    };
    try {
      return await this.prismaService.users.findMany({
        where,
      })
    } catch (error) {
      return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error del servidor.');
    }

  }

  async findByMail(email: string) {
    let user;
    try {
      user = await this.prismaService.users.findUnique({
        where: {
          email: email.toString().trim().toLowerCase()
        }
      })
    } catch (error) {
      return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error del servidor.');
    }
    if (!user) {
      throw new NotFoundException({
        title: 'Usuario no encontrado.',
        status: 404,
        error: 'Usuario no encontrado.',
        details: 'Usuario no encontrado.'
      })
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prismaService.users.update({
        where: {
          id: id,
        }, data: updateUserDto
      })
      if (!updatedUser) {
        throw new NotFoundException({
          title: 'Usuario no actualizado.',
          status: 404,
          error: 'Usuario no actualizado.',
          details: 'Usuario no actualizado..'
        })
      }
      return updatedUser;
    } catch (error) {
      this.handleExceptions(error);
    }
    return `This action updates a #${id} user`;
  }

  async getAuthCode(authority, scopes, state, res) {
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;
    //Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration
    tokenRequest.authority = authority;
    // request an authorization code to exchange for a token
    return await confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
  }

  signIn(res) {
    //Initiate a Auth Code Flow >> for sign in
    //no scopes passed. openid, profile and offline_access will be used by default.
    const url = this.getAuthCode(this.configService.get('SIGN_UP_SIGN_IN_POLICY_AUTHORITY'), [], this.configuration.APP_B2C_STATES.LOGIN, res);
    return url
  }

  signout() {
    return this.configService.get('LOGOUT_ENDPOINT');
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: error.detail,
        error: 'Error creando usuario',
        title: 'Error creando usuario'
      })
    }

    if (error.code === 'P2002') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: `Ya existe un registro duplicado por el campo ${error.meta.target[0]}`,
        error: 'Error creando usuario, el usuario ya se encuentra registrado.',
        title: 'El usuario ya se encuentra registrado.'
      })
    }
    throw new BadRequestException('Error inesperado, revise los logs del servidor.')
  }
}
