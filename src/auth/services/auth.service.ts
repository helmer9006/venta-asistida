import {
  Injectable,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GetTokenDto } from '@src/auth/models/dto/get-token.dto';
import { handleExceptions } from '@src/shared/helpers/general';

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
export class AuthService {
  constructor(
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
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
        'Error consultando url de login.',
      );
    }
  }

  signIn() {
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

  async findUserAndTokenByCode(code: GetTokenDto, req, res) {
    tokenRequest.code = code;
    let userUid, email, idTokenClaims, token, isNew;
    try {
      const response: any =
        await confidentialClientApplication.acquireTokenByCode(tokenRequest);
      userUid = response?.idTokenClaims?.sub || null;
      email =
        response?.idTokenClaims?.emails?.length > 0
          ? response.idTokenClaims.emails[0]
          : null;
      token = response?.idToken || null;
      idTokenClaims = response?.idTokenClaims || null;
      isNew = response?.idTokenClaims?.newUser || false;

      if (!userUid)
        throw new UnauthorizedException(
          'No es posible validar la identidad del usuario.',
        );
      if (!email)
        throw new UnauthorizedException(
          'No es posible validar la identidad del usuario.',
        );
      const user = await this.prismaService.users.findUnique({
        where: { email },
        include: {
          roles: true,
        },
      });
      const rolStatus: boolean = user.roles?.isActive || false;
      if (!user)
        throw new UnauthorizedException(
          'El usuario no se encuentra registrado.',
        );
      if (!rolStatus)
        throw new UnauthorizedException(
          'El rol asignado al usuario se encuentra inactivo.',
        );
      if (!user.isActive)
        throw new UnauthorizedException('El usuario se encuentra inactivo.');
      console.log('vali', user.uid.length);
      if (user.uid.length > 0 && userUid !== user.uid)
        throw new UnauthorizedException(
          `El usuario ${user.name} ${user.lastname} se encuentra registrado con otro proveedor de identidad.`,
        );
      if (isNew || user?.uid === '') {
        await this.prismaService.users.update({
          where: {
            id: user.id,
          },
          data: { uid: userUid },
        });
      }
      const modules = await this.prismaService.modules.findMany({
        where: { permissions: { some: {} } },
        include: {
          permissions: {
            where: {
              rolesPermission: {
                some: {
                  roleId: user.roleId,
                },
              },
            },
          },
        },
      });
      const modulesToReturn = modules.filter(
        (module) => module.permissions.length > 0,
      );
      return { user, token, idTokenClaims, modules: modulesToReturn };
    } catch (error) {
      handleExceptions(error);
    }
  }
}
