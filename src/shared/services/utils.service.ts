import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '../adapters/axios.adapter';
import { IReponseTokenMule } from '../interfaces/response-token-mule.interface';
import { Logger } from '@nestjs/common';
import { handleExceptions } from '../helpers/general';
@Injectable()
export class UtilsService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
  ) {}
  logger = new Logger('UtilsService');
  async validatePermission(code: string, roleId: number) {
    try {
      const permission = await this.prismaService.permissions.findMany({
        where: {
          code: code,
          rolesPermission: {
            some: { roleId: roleId },
          },
        },
        include: { rolesPermission: true },
      });
      if (permission.length == 0) throw Error;
      return;
    } catch (error) {
      throw new GenericResponse(
        {},
        401,
        'No tiene permisos necesario para acceder al recurso.',
      );
    }
  }

  async sendEmailMule(url: string, body: any, headers: object) {
    try {
      const token = await this.generateTokenMule();
      if (!token) {
        return {};
      }
      headers['Authorization'] = `Bearer ${token}`;
      const response = await this.http.post(url, body, headers);
      return response;
    } catch (error) {
      this.logger.error(
        `Error del servidor enviando correo a mule. Error ${JSON.stringify(
          error,
        )}`,
      );
      // TODO: validar acción si hay error al enviar el correo de invitación.
    }
  }

  private async generateTokenMule() {
    const url = this.configService.get('MULE_URL_GENERATE_TOKEN');
    const headers = {
      Client_id: this.configService.get('MULE_CLIENT_ID'),
      Client_secret: this.configService.get('MULE_CLIENT_SECRET'),
      grant_type: this.configService.get('MULE_GRANT_TYPE'),
    };
    try {
      const { access_token }: IReponseTokenMule = await this.http.post(
        url,
        {},
        headers,
      );
      if (!access_token) return '';
      return access_token;
    } catch (error) {
      this.logger.error(
        `Error al consultar token en mule. Error ${JSON.stringify(error)}`,
      );
      return '';
    }
  }

  async findAllyById(alliesId: number[]) {
    try {
      const allyFound = await this.prismaService.users.findMany({
        where: {
          id: { in: alliesId },
          roleId: Number(process.env.ID_ROLE_ALLY),
        },
      });
      if (allyFound.length == 0 || allyFound.length < alliesId.length) {
        throw new NotFoundException('No se pudo encontrar el aliado.');
      }
      return allyFound;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAdvisorById(advisorId: number) {
    try {
      const advisorFound = await this.prismaService.users.findMany({
        where: { id: advisorId, roleId: Number(process.env.ID_ROLE_ADVISOR) },
      });
      if (advisorFound.length == 0) {
        throw new NotFoundException('No se pudo encontrar el asesor.');
      }
      return advisorFound[0];
    } catch (error) {
      handleExceptions(error);
    }
  }
}
