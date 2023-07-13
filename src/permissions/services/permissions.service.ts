import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { Permission } from '../entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { ConflictException } from '@src/shared/exceptions';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) { }
  async findAll() {
    try {
      return await this.prismaService.permissions.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error consultando permisos.')
    }
  }

  async findPermissionsByRole(roleId: number) {
    try {
      const permission = await this.prismaService.permissions.findMany({
        include: {
          rolesPermission: {
            where: {
              roleId: roleId
            },
          }
        },
        orderBy: {
          description: 'asc',
        },
      });
      return permission;
    } catch (error) {
      throw new InternalServerErrorException('Error consultando permisos del rol.')
    }
  }
}
