import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from '../models/dto/create-role.dto';
import { UpdateRoleDto } from '../models/dto/update-role.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { BadRequestException, ConflictException } from '@src/shared/exceptions';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { ICreateRolePermission } from '../interface/create-role-permission.interface';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';

@Injectable()
export class RolesService {

  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }
  async create(createRoleDto: CreateRoleDto) {
    let role;
    try {
      const permissions = createRoleDto.permissions;
      createRoleDto.name = createRoleDto.name.toLowerCase().trim();
      delete createRoleDto.permissions
      role = await this.prismaService.roles.create({ data: createRoleDto })
      if (!role) {
        return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error al crear rol.');
      }
      if (permissions.length > 0) {
        let rolesPermissions: ICreateRolePermission[] = permissions.map(permission => { return { roleId: role.id, permissionId: permission } })

        const insertPermissionsNewRol = await this.prismaService.rolesPermissions.createMany({
          data: rolesPermissions,
        })
      }
      return await this.prismaService.roles.findMany({
        include: {
          rolesPermissions: {
            include: {
              permissions: true,
            },
          },
        },
      });
    } catch (error) {
      if (role && role.id) {
        await this.prismaService.roles.delete({
          where: { id: role.id }
        })
      }
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.prismaService.roles.findMany({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error al buscar roles.');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let role;
    try {
      const permissions = updateRoleDto?.permissions || [];
      if (updateRoleDto && updateRoleDto.name) {
        updateRoleDto.name.toLowerCase().trim()
      }
      delete updateRoleDto.permissions
      role = await this.prismaService.roles.update({
        where: {
          id: id,
        }, data: updateRoleDto
      })
      if (!role) {
        return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error al actualizar rol.');
      }

      if (permissions.length > 0) {
        await this.updateRolePermission(role.id, permissions);
      }
      return await this.prismaService.roles.findMany({
        where: { id: role.id },
        include: {
          rolesPermissions: {
            include: {
              permissions: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      this.handleExceptions(error)
    }
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: error.detail,
        error: 'Error creando rol',
        title: 'Error creando rol'
      })
    }

    if (error.code === 'P2002') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: `Ya existe un registro duplicado por el campo ${error.meta.target[0]}`,
        error: 'Error, el rol ya se encuentra registrado.',
        title: 'El rol ya se encuentra registrado.'
      })
    }
    if (error.code === 'P2003') {
      throw new ConflictException({
        status: HttpStatus.CONFLICT.valueOf(),
        details: `Error ${error.meta.field_name}`,
        error: 'Error, no se pudo insertar el rol',
        title: 'No se pudo insertar el rol.'
      })
    }
    throw new BadRequestException('Error inesperado, revise los logs del servidor.')
  }

  async updateRolePermission(roleId: number, permissions: number[]) {
    try {
      let currentPermissions = await this.prismaService.rolesPermissions.findMany({
        where: { roleId: roleId }
      })
      const IdsCurrentRolesPermissions = currentPermissions.map(permission => permission.permissionId)
      let permissionsToInsert = permissions.filter(permiso => !IdsCurrentRolesPermissions.includes(permiso))
      let permissionsToDelete = IdsCurrentRolesPermissions.filter(permiso => !permissions.includes(permiso))
      let IdsPermissionsToDelete = currentPermissions.filter(permission => permissionsToDelete.includes(permission.permissionId)).map(item => item.id)

      if (IdsPermissionsToDelete && IdsPermissionsToDelete.length > 0) {
        await this.prismaService.rolesPermissions.deleteMany({
          where: {
            id: {
              in: IdsPermissionsToDelete,
            }
          },
        });
      }

      if (permissionsToInsert && permissionsToInsert.length > 0) {
        let rolesPermissions: ICreateRolePermission[] = permissionsToInsert.map(permission => { return { roleId: roleId, permissionId: permission } })
        await this.prismaService.rolesPermissions.createMany({
          data: rolesPermissions,
        })
      }

      return;
    } catch (error) {
      new GenericResponse({}, 500, "El Rol fue actualizado pero Se presento un error al actualizar sus permisos.")
    }
  }

  async findPermissionsByRole(roleId: number) {
    try {
      return await this.prismaService.rolesPermissions.findMany({
        where: { roleId: roleId },
        include: {
          permissions: true,
        },
      });
    } catch (error) {
      return new GenericResponse([], HttpStatus.INTERNAL_SERVER_ERROR.valueOf(), 'Error al buscar permisos del rol.');
    }
  }
}
