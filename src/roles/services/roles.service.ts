import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CreateRoleDto } from '../models/dto/create-role.dto';
import { UpdateRoleDto } from '../models/dto/update-role.dto';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { BadRequestException, ConflictException } from '@src/shared/exceptions';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { ICreateRolePermission } from '../interface/create-role-permission.interface';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { UtilsService } from '../../shared/services/utils.service';
import { ConfigType } from '@nestjs/config';
import config from '@src/config/config';
import { LogsService } from '@src/logs/services/logs.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilService: UtilsService,
    @Inject(config.KEY)
    private readonly configuration: ConfigType<typeof config>,
    private readonly logs: LogsService,
  ) {}
  logger = new Logger('RolesService');
  async create(createRoleDto: CreateRoleDto, userId: number) {
    let role;
    try {
      const permissions = createRoleDto.permissions;
      createRoleDto.name = createRoleDto.name.toLowerCase().trim();
      delete createRoleDto.permissions;
      role = await this.prismaService.roles.create({ data: createRoleDto });
      if (permissions.length > 0) {
        const rolesPermissions: ICreateRolePermission[] = permissions.map(
          (permission) => {
            return { roleId: role.id, permissionId: permission };
          },
        );
        await this.prismaService.rolesPermissions.createMany({
          data: rolesPermissions,
        });
      }
      // Insert log for audit
      const { action, description } = this.configuration.AUDIT_ACTIONS
        ? this.configuration.AUDIT_ACTIONS.ROLE_CREATE
        : null;
      const dataObject = {
        actionUserId: userId,
        description: description,
        typeAction: action,
        data: JSON.stringify(createRoleDto),
        model: this.configuration.MODELS.ROLES,
        modelId: role.id,
        createdAt: new Date(),
      };
      await this.logs.create(dataObject);

      const roleFound = await this.prismaService.roles.findUnique({
        where: { id: role.id },
        include: {
          rolesPermissions: {
            select: {
              permissions: true,
            },
          },
        },
      });
      const permissionsByRole = roleFound.rolesPermissions.map(
        (permission) => permission.permissions,
      );
      delete roleFound.rolesPermissions;
      return { ...roleFound, permissions: permissionsByRole };
      //return role;
    } catch (error) {
      if (role && role.id) {
        await this.prismaService.roles.delete({
          where: { id: role.id },
        });
      }
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 1, name } = paginationDto;
      return await this.prismaService.roles.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          rolesPermissions: {
            include: {
              permissions: true,
            },
          },
        },
        take: limit,
        skip: (offset - 1) * limit,
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error al consultar roles.',
      );
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, userId: number) {
    let role;
    try {
      const permissions = updateRoleDto?.permissions || [];
      if (updateRoleDto && updateRoleDto.name) {
        updateRoleDto.name.toLowerCase().trim();
      }
      delete updateRoleDto.permissions;

      role = await this.prismaService.roles.update({
        where: {
          id: id,
        },
        data: updateRoleDto,
      });

      // Insert log for audit
      const { action, description } = this.configuration.AUDIT_ACTIONS
        ? this.configuration.AUDIT_ACTIONS.ROLE_UPDATE
        : null;
      const dataObject = {
        actionUserId: userId,
        description: description,
        typeAction: action,
        data: JSON.stringify(updateRoleDto),
        model: this.configuration.MODELS.ROLES,
        modelId: role.id,
        createdAt: new Date(),
      };
      await this.logs.create(dataObject);

      if (permissions.length > 0) {
        await this.updateRolePermission(role.id, permissions);
      }
      return role;
    } catch (error) {
      this.logger.error(error);
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505')
      throw new GenericResponse(
        {},
        HttpStatus.CONFLICT.valueOf(),
        'Error gestionando rol.',
      );
    if (error.code === 'P2002')
      throw new GenericResponse(
        {},
        HttpStatus.CONFLICT.valueOf(),
        'El rol ya se encuentra registrado, validar el nombre.',
      );
    if (error.code === 'P2003')
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'No se pudo gestionar el rol por error de comunicación con la base de datos.',
      );
    throw new GenericResponse(
      {},
      HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
      'Error inesperado del servidor.',
    );
  }

  async updateRolePermission(roleId: number, permissions: number[]) {
    try {
      const currentPermissions =
        await this.prismaService.rolesPermissions.findMany({
          where: { roleId: roleId },
        });
      const IdsCurrentRolesPermissions =
        currentPermissions.length > 0
          ? currentPermissions.map((permission) => permission.permissionId)
          : [];
      const permissionsToInsert = permissions.filter(
        (permiso) => !IdsCurrentRolesPermissions.includes(permiso),
      );
      const permissionsToDelete = IdsCurrentRolesPermissions.filter(
        (permiso) => !permissions.includes(permiso),
      );
      const IdsPermissionsToDelete = currentPermissions
        .filter((permission) =>
          permissionsToDelete.includes(permission.permissionId),
        )
        .map((item) => item.id);

      if (IdsPermissionsToDelete && IdsPermissionsToDelete.length > 0) {
        await this.prismaService.rolesPermissions.deleteMany({
          where: {
            id: {
              in: IdsPermissionsToDelete,
            },
          },
        });
      }
      let res;
      if (permissionsToInsert && permissionsToInsert.length > 0) {
        const rolesPermissions: ICreateRolePermission[] =
          permissionsToInsert.map((permission) => {
            return { roleId: roleId, permissionId: permission };
          });
        res = await this.prismaService.rolesPermissions.createMany({
          data: rolesPermissions,
        });
      }

      return res;
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'El Rol fue actualizado pero Se presento un error al actualizar sus permisos.',
      );
    }
  }

  async findModulesByRole(roleId: number) {
    try {
      const modules = await this.prismaService.modules.findMany({
        where: { permissions: { some: {} } },
        include: {
          permissions: {
            where: {
              rolesPermission: {
                some: {
                  roleId: roleId,
                },
              },
            },
          },
        },
      });
      const modulesToReturn = modules.filter(
        (module) => module.permissions.length > 0,
      );
      return modulesToReturn;
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error consultando permisos del rol.',
      );
    }
  }
}
