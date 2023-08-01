import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Permission } from '../entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { ConflictException } from '@src/shared/exceptions';
import { ConfigService } from '@nestjs/config';
import { handleExceptions } from '@src/shared/helpers/general';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async findAll() {
    const permissionsOnlySuper = this.configService.get(
      'PERMISSIONS_DEFAULT_SUPERADMINISTRADOR',
    );
    try {
      let permissions = await this.prismaService.permissions.findMany({
        orderBy: {
          description: 'asc',
        },
      });
      if (permissionsOnlySuper != undefined)
        permissions = permissions.filter(
          (permission) => !permissionsOnlySuper.includes(permission.id),
        );
      return permissions;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findPermissionsByRole(roleId: number) {
    try {
      const permission = await this.prismaService.permissions.findMany({
        include: {
          rolesPermission: {
            where: {
              roleId: roleId,
            },
          },
        },
        orderBy: {
          description: 'asc',
        },
      });
      return permission;
    } catch (error) {
      handleExceptions(error);
    }
  }
}
