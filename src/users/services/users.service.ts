import {
  Injectable,
  HttpStatus,
  Logger,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { ConfigService, ConfigType } from '@nestjs/config';
import { validate as IsUUID } from 'uuid';
import { CreateUserDto, RequestUserDto, UpdateUserDto } from '../models/dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@src/shared/exceptions';
import config from '@src/config/config';
import { isNumber } from '@src/shared/helpers/general';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { UtilsService } from '../../shared/services/utils.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { readFileSync } from 'fs';
import { IResponseSignIn } from '@src/shared/interfaces/response-signin.interface';
import { LogsService } from '@src/logs/services/logs.service';
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
    private readonly utilService: UtilsService,
    private readonly logs: LogsService,
  ) {}

  logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto, userId: number, roleId) {
    // await this.utilService.validatePermission('USE001', roleId)
    const { description, action } = this.configuration.AUDIT_ACTIONS
      ? this.configuration.AUDIT_ACTIONS.USER_CREATE
      : null;
    try {
      createUserDto.email = createUserDto.email.toLowerCase().trim();
      createUserDto.name = createUserDto.name.toLowerCase().trim();
      createUserDto.lastname = createUserDto.lastname.toLowerCase().trim();
      const userCreated = await this.prismaService.users.create({
        data: createUserDto,
      });
      const userName = `${userCreated.name} ${userCreated.lastname}`;
      // email sent to a new user to finish registration
      await this.sendEmailInvitationMule(userName, createUserDto.email);
      // Insert log for audit
      const dataObject = {
        actionUserId: userId,
        description: description,
        typeAction: action,
        data: JSON.stringify(createUserDto),
        model: this.configuration.MODELS.USERS,
        modelId: userCreated.id,
        createdAt: new Date(),
      };
      this.logs.create(dataObject);
      return userCreated;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 1 } = paginationDto;
      return await this.prismaService.users.findMany({
        take: limit,
        skip: (offset - 1) * limit,
        include: { ally: true, roles: true, supervisor: true },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      console.log(error);
      throw new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error de servidor al consultar usuarios.',
      );
    }
  }

  async findByterm(term: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 1 } = paginationDto;
    let where;
    if (isNumber(term.trim())) {
      where = { identification: term };
    } else {
      where = {
        OR: [
          {
            name: {
              contains: term,
              mode: 'insensitive',
            },
          },
          {
            ally: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        ],
      };
    }
    try {
      return await this.prismaService.users.findMany({
        where,
        include: {
          ally: true,
          roles: true,
          supervisor: true,
        },
        take: limit,
        skip: (offset - 1) * limit,
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error de servidor al consultar usuarios.',
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
        include: {
          ally: true,
          roles: true,
          supervisor: true,
        },
      });
    } catch (error) {
      throw new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error de servidor al consultar usuarios.',
      );
    }
    if (!user)
      throw new GenericResponse(
        [],
        HttpStatus.NOT_FOUND.valueOf(),
        'Usuario no encontrado.',
      );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const { description, action } = this.configuration.AUDIT_ACTIONS
      ? this.configuration.AUDIT_ACTIONS.USER_UPDATE
      : null;
    try {
      if (updateUserDto.email)
        updateUserDto.email = updateUserDto.email.toLowerCase().trim();
      if (updateUserDto.name)
        updateUserDto.name = updateUserDto.name.toLowerCase().trim();
      if (updateUserDto.lastname)
        updateUserDto.lastname = updateUserDto.lastname.toLowerCase().trim();

      const updatedUser = await this.prismaService.users.update({
        where: {
          id: id,
        },
        data: updateUserDto,
      });
      if (!updatedUser)
        throw new GenericResponse(
          {},
          HttpStatus.NOT_FOUND.valueOf(),
          'El usuario no pudo ser actualizado.',
        );
      const dataObject = {
        actionUserId: userId,
        description: description,
        typeAction: action,
        data: JSON.stringify(updateUserDto),
        model: this.configuration.MODELS.USERS,
        modelId: updatedUser.id,
        createdAt: new Date(),
      };
      this.logs.create(dataObject);
      return updatedUser;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505')
      throw new GenericResponse(
        {},
        HttpStatus.CONFLICT.valueOf(),
        'Error gestionando usuario.',
      );
    if (error.code === 'P2002')
      throw new GenericResponse(
        {},
        HttpStatus.CONFLICT.valueOf(),
        'El usuario ya se encuentra registrado, validar correo o identificación',
      );
    if (error.code === 'P1001')
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Ha ocurrido un error de conexión con la base de datos.',
      );
    this.logger.error(
      `Error inesperado, revise los logs del servidor. Error ${JSON.stringify(
        error,
      )}`,
    );
    throw new GenericResponse(
      {},
      HttpStatus.BAD_REQUEST.valueOf(),
      'Error inesperado del servidor',
    );
  }

  async getAuthCode(authority, scopes, state) {
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;
    tokenRequest.authority = authority;
    try {
      return await confidentialClientApplication.getAuthCodeUrl(
        authCodeRequest,
      );
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error consultando url login.',
      );
    }
  }

  signIn() {
    const LOGIN = this.configuration.APP_B2C_STATES
      ? this.configuration.APP_B2C_STATES.LOGIN
      : null;
    const url = this.getAuthCode(
      this.configService.get('SIGN_UP_SIGN_IN_POLICY_AUTHORITY'),
      [],
      this.configuration.APP_B2C_STATES.LOGIN,
    );
    return url;
  }

  signout() {
    return this.configService.get('LOGOUT_ENDPOINT');
  }

  async sendEmailInvitationMule(nameUser: string, email: string) {
    const formData = new FormData();
    const url: string = await this.signIn();
    const fileData = readFileSync(
      './src/shared/templates/invitation-new-user.html',
      'utf-8',
    );
    let body = fileData.toString();
    body = body.replace('@NAME', nameUser);
    body = body.replace('<URL_REDIRECCION>', url);
    const data = {
      to: [email],
      cc: [],
      body: body,
      account: '26cb3b68-0a53-44bb-890a-ff7291b7f333',
      type: 'SendCode',
      subject: 'Registro de usuario',
      isBodyHtml: true,
      configParameters: {
        expiry: 300,
      },
      replacementData: {
        __NAME__: 'Helmer',
        __LASTNAME__: 'Villarreal Larios',
      },
    };
    const jsonData = JSON.stringify(data);
    formData.append('body', jsonData);
    const headers = {
      'Content-Type': 'multipart/form-data',
      client_id: this.configService.get('MULE_CLIENT_ID_METHOD'),
      client_secret: this.configService.get('MULE_CLIENT_SECRET_METHOD'),
    };
    const urlMule = this.configService.get('MULE_URL_SEND_EMAIL');
    return await this.utilService.sendEmailMule(urlMule, formData, headers);
  }

  async findByRoleId(roleId: number, paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 1 } = paginationDto;
      return await this.prismaService.users.findMany({
        where: { roleId: roleId },
        include: {
          ally: true,
          roles: true,
          supervisor: true,
        },
        take: limit,
        skip: (offset - 1) * limit,
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error de servidor al consultar usuarios.',
      );
    }
  }
}
