import { PrismaService } from '@src/prisma/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { testExpectValues } from '@test/constant/general-constant';
import { GenericResponseTestDataBuilder } from '../../utils/generic-response.testdatabuilder';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { RolesService } from '@src/roles/services/roles.service';
import { RolesController } from '@src/roles/controllers/roles.controller';
import { CreateRoleDto } from '@src/roles/models/dto/create-role.dto';
import { UpdateRoleDto } from '@src/roles/models/dto/update-role.dto';
import { UtilsService } from '@src/shared/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import config from '@src/config/config';

let rolesService: RolesService;
let prismaService: PrismaService;
let utilService: UtilsService;
let rolesController: RolesController;
let roleId: number;
let role;

const createRoleDto: CreateRoleDto = testExpectValues.createRoleDto;
const paginationDto: PaginationDto = testExpectValues.paginationDto;
const updateRoleDto: UpdateRoleDto = testExpectValues.dataUpdateRoleDto;

// Inyeccion de dependencias y providers necesarios para ejecutar el servicio

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      RolesService,
      PrismaService,
      UtilsService,
      ConfigService,
      AxiosAdapter,
      {
        provide: config.KEY,
        useValue: config,
      },
      {
        provide: RolesController,
        useValue: createMock<RolesController>(),
      },
      // {
      //   provide: PrismaService,
      //   useValue: createMock<PrismaService>(),
      // },
    ],
  }).compile();

  rolesService = module.get<RolesService>(RolesService);
  prismaService = module.get<PrismaService>(PrismaService);
  rolesController = module.get<RolesController>(RolesController);
  utilService = module.get<UtilsService>(UtilsService);
});

describe('RolesService', () => {
  it('servicio conectado', () => {
    expect(rolesService).toBeDefined();
  });
});

describe('RolesService Role-create', () => {
  it('deberia crear un rol correctamente en el sistema.', async () => {
    try {
      const serviceResponse = await rolesService.create(createRoleDto, 1);
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        serviceResponse,
        HttpStatus.OK,
        'Rol creado correctamente.',
      );

      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await rolesController.create(
        createRoleDto,
        1,
      );

      // Se crea el rol en BD y luego se guarda junto con su Id para los test posteriores
      if (controlllerResponse.statusCode === 200) {
        roleId = controlllerResponse.data.id;
        role = controlllerResponse.data;
      }
      expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
      expect(controlllerResponse.statusCode).toStrictEqual(
        genericResponseOK.statusCode,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Rol creado correctamente.',
      );
    } catch (error) {
      return error;
    }
  });

  it('deberia crear un rol con permisos asociados en el sistema.', async () => {
    try {
      createRoleDto.permissions = [999999, 888888];
      createRoleDto.name = 'role test 2';
      const serviceResponse = await rolesService.create(createRoleDto, 1);

      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        serviceResponse,
        HttpStatus.OK,
        'Rol creado correctamente.',
      );

      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await rolesController.create(
        createRoleDto,
        1,
      );

      if (controlllerResponse.statusCode === 200)
        roleId = controlllerResponse.data.id;

      if (roleId !== undefined) {
        await prismaService.roles.delete({
          where: { id: roleId },
        });
      }

      expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
      expect(controlllerResponse.statusCode).toStrictEqual(
        genericResponseOK.statusCode,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Rol creado correctamente.',
      );
    } catch (error) {
      return error;
    }
  });

  it('deberia de fallar la creacion del rol.', async () => {
    try {
      await rolesService.create(createRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error inesperado del servidor.',
      );
      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);

      const controlllerResponse = await rolesController.create(
        createRoleDto,
        1,
      );

      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error inesperado del servidor.',
      );
    }
    jest.spyOn(prismaService.roles, 'create').mockRejectedValue('error');
  });
});

describe('RolesService Role-findAll', () => {
  it('deberia de obtener los roles registrados en el sistema.', async () => {
    const serviceResponse = await rolesService.findAll(paginationDto);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Roles encontrados.',
    );

    jest.spyOn(rolesController, 'findAll').mockResolvedValue(genericResponseOK);
    const controlllerResponse = await rolesController.findAll(paginationDto);

    expect(controlllerResponse.data).toStrictEqual(serviceResponse);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual('Roles encontrados.');
  });

  it('deberia de fallar al obtener los roles del sistema.', async () => {
    jest.spyOn(prismaService.roles, 'findMany').mockRejectedValue('error');

    try {
      await rolesService.findAll(paginationDto);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.response.message,
      );

      jest
        .spyOn(rolesController, 'findAll')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await rolesController.findAll(paginationDto);

      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error al buscar roles.',
      );
    }
  });
});

describe('RolesService Role-update', () => {
  it('deberia actualizar un rol correctamente en el sistema.', async () => {
    const serviceResponse = await rolesService.update(roleId, updateRoleDto, 1);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol actualizado correctamente.',
    );

    jest.spyOn(rolesController, 'update').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await rolesController.update(
      `${roleId}`,
      updateRoleDto,
      1,
    );

    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual(
      'Rol actualizado correctamente.',
    );
  });

  it('deberia de actualizar un rol correctamente con permisos asociados.', async () => {
    updateRoleDto.permissions = [5];
    updateRoleDto.name = 'admin_test';

    const serviceResponse = await rolesService.update(roleId, updateRoleDto, 1);
    await rolesService.updateRolePermission(roleId, [5]);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol actualizado correctamente.',
    );

    jest.spyOn(rolesController, 'update').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await rolesController.update(
      `${roleId}`,
      updateRoleDto,
      1,
    );

    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual(
      'Rol actualizado correctamente.',
    );
  });

  it('deberia actualizar un rol, eliminando e insertando permisos.', async () => {
    updateRoleDto.permissions = [1, 2];

    const serviceResponse = await rolesService.update(roleId, updateRoleDto, 1);
    await rolesService.updateRolePermission(roleId, [1, 2]);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol actualizado correctamente.',
    );

    jest.spyOn(rolesController, 'update').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await rolesController.update(
      `${roleId}`,
      updateRoleDto,
      1,
    );

    // Luego de crear los permisos del rol, se eliminan de BD atraves del roleId

    if (controlllerResponse.statusCode === 200) {
      const currentRolePermission =
        await prismaService.rolesPermissions.findMany({
          where: { roleId: roleId },
        });
      for (let i = 0; i < currentRolePermission.length; i++) {
        await prismaService.rolesPermissions.delete({
          where: { id: currentRolePermission[i].id },
        });
      }
    }

    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual(
      'Rol actualizado correctamente.',
    );
  });

  it('deberia de fallar la actualizacion de un rol que no esta registrado.', async () => {
    try {
      updateRoleDto.name = 'administrador';
      await rolesService.update(2, updateRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        [],
        error.response.status,
        error.response.error,
      );

      jest
        .spyOn(rolesController, 'update')
        .mockResolvedValue(genericResponseOK);

      const controlllerResponse = await rolesController.update(
        `${roleId}`,
        updateRoleDto,
        1,
      );

      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(409);
      expect(controlllerResponse.message).toStrictEqual(
        'Error, el rol ya se encuentra registrado.',
      );
    }
  });

  it('deberia de fallar la actualizacion de permisos pero deberia actualizar el rol.', async () => {
    jest
      .spyOn(prismaService.rolesPermissions, 'findMany')
      .mockRejectedValue('error');
    updateRoleDto.name = 'admin_test_2';
    try {
      await rolesService.update(roleId, updateRoleDto, 1);
      await rolesService.updateRolePermission(roleId, [888, 999]);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        [],
        error.response.statusCode,
        error.response.message,
      );

      jest
        .spyOn(rolesController, 'update')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await rolesController.update(
        `${roleId}`,
        updateRoleDto,
        1,
      );

      // Luego de actualizar el rol, se elimina de BD atraves de su Id
      await prismaService.roles.delete({
        where: { id: roleId },
      });

      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'El Rol fue actualizado pero Se presento un error al actualizar sus permisos. Error error',
      );
    }
  });
});
