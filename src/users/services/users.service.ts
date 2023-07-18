import { Injectable, HttpStatus, Logger, InternalServerErrorException, Inject } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { ConfigService, ConfigType } from '@nestjs/config';
import { validate as IsUUID } from 'uuid';
import { CreateUserDto, RequestUserDto, UpdateUserDto } from '../models/dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConflictException, BadRequestException, UnauthorizedException, NotFoundException } from '@src/shared/exceptions';
import config from '@src/config/config';
import { isNumber } from '@src/shared/helpers/general';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { UtilsService } from '../../shared/services/utils.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { readFileSync } from 'fs';
import { IResponseSignIn } from '@src/shared/interfaces/response-signin.interface';
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
  ) { }

  logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto, userId: number, roleId) {
    await this.utilService.validatePermission('USER001', roleId)
    const auditAction = this.configuration.AUDIT_ACTIONS ? this.configuration.AUDIT_ACTIONS.USER_CREATE : null;
    try {
      createUserDto.email = createUserDto.email.toLowerCase().trim();
      createUserDto.name = createUserDto.name.toLowerCase().trim();
      createUserDto.lastname = createUserDto.lastname.toLowerCase().trim();
      const userCreated = await this.prismaService.users.create({ data: createUserDto })
      const userName = `${userCreated.name} ${userCreated.lastname}`
      // email sent to a new user to finish registration
      await this.sendEmailInvitationMule(userName, createUserDto.email);
      // Insert log for audit
      await this.utilService.saveLogs(userId, createUserDto, auditAction)
      return userCreated;
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
    let userUid, email, idTokenClaims, token, isNew;

    try {
      let response: any = await confidentialClientApplication.acquireTokenByCode(tokenRequest)
      userUid = response?.idTokenClaims?.sub || null;
      email = response?.idTokenClaims?.emails[0] || null;
      token = response?.idToken || null;
      idTokenClaims = response?.idTokenClaims || null;
      isNew = response?.idTokenClaims?.newUser || false

    } catch (error) {
      throw new UnauthorizedException('No es posible validar la identidad del usuario.')
    }

    if (!userUid) {
      throw new NotFoundException({
        title: 'No existe id de usuario.',
        status: 404,
        error: 'No éxiste id de usuario.',
        details: 'No éxiste id de usuario.'
      })
    }
    if (!email) throw new UnauthorizedException('No es posible validar la identidad del usuario.')
    const user = await this.prismaService.users.findUnique({
      where: { email },
      include: {
        roles: true
      }
    });
    const rolStatus: boolean = user.roles?.isActive || false;
    if (!user) throw new UnauthorizedException('El usuario no se encuentra registrado.')
    if (!rolStatus) throw new UnauthorizedException('El rol asignado al usuario no se encuentra activo.')

    if (isNew) {
      await this.prismaService.users.update({
        where: {
          id: user.id,
        }, data: { uid: userUid }
      })
    }
    const modules = await this.prismaService.modules.findMany({
      where: { permissions: { some: {} } },
      include: {
        permissions: {
          where: {
            rolesPermission: {
              some: {
                roleId: user.roleId
              }
            }
          }
        }
      }
    });
    const modulesToReturn = modules.filter(module => module.permissions.length > 0)
    return { user, token, idTokenClaims, modules: modulesToReturn }
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const auditAction =  this.configuration.AUDIT_ACTIONS ? this.configuration.AUDIT_ACTIONS.USER_UPDATE : null;
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
    this.logger.error(`Error inesperado, revise los logs del servidor. Error ${JSON.stringify(error)}`)
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
    const LOGIN = this.configuration.APP_B2C_STATES ? this.configuration.APP_B2C_STATES.LOGIN : null
    const url = this.getAuthCode(this.configService.get('SIGN_UP_SIGN_IN_POLICY_AUTHORITY'), [], this.configuration.APP_B2C_STATES.LOGIN);
    return url
  }

  signout() {
    return this.configService.get('LOGOUT_ENDPOINT');
  }

  async sendEmailInvitationMule(nameUser: string, email: string) {
    const formData = new FormData();
    const url: string = await this.signIn();
    const fileData = readFileSync('./src/shared/templates/invitation-new-user.html', 'utf-8');
    let body = fileData.toString();
    body = body.replace('@NAME', nameUser);
    body = body.replace('<URL_REDIRECCION>', url);
    const data = {
      "to": [email],
      "cc": [],
      "body": body,
      "account": "26cb3b68-0a53-44bb-890a-ff7291b7f333",
      "type": "SendCode",
      "subject": "Registro de usuario",
      "isBodyHtml": true,
      "configParameters": {
        "expiry": 300
      },
      "replacementData": {
        "__NAME__": "Helmer",
        "__LASTNAME__": "Villarreal Larios"
      }
    }
    const jsonData = JSON.stringify(data);
    formData.append('body', jsonData);
    const headers = {
      'Content-Type': 'multipart/form-data',
      'client_id': this.configService.get('MULE_CLIENT_ID_METHOD'),
      'client_secret': this.configService.get('MULE_CLIENT_SECRET_METHOD'),
    };
    const urlMule = this.configService.get('MULE_URL_SEND_EMAIL');
    return await this.utilService.sendEmailMule(urlMule, formData, headers)
  }
}