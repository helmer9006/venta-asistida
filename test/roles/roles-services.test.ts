import { PrismaService } from '@src/prisma/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { testExpectValues } from '@test/constant/general-constant';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { RolesService } from '@src/roles/services/roles.service';
import { RolesController } from '@src/roles/controllers/roles.controller';
import { CreateRoleDto } from '@src/roles/models/dto/create-role.dto';
import { UpdateRoleDto } from '@src/roles/models/dto/update-role.dto';
import { UtilsService } from '@src/shared/services/utils.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import config from '@src/config/config';
import { LogsService } from '@src/logs/services/logs.service';

let rolesService: RolesService;
let prismaService: PrismaService;
let utilService: UtilsService;
let rolesController: RolesController;
let configuration: ConfigType<typeof config>;
let logs: LogsService;
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
      ConfigService,
      UtilsService,
      LogsService,
      AxiosAdapter,
      {
        provide: config.KEY,
        useValue: createMock<typeof configuration>({
          AUDIT_ACTIONS: {
            ROLE_CREATE: {
              action: 'ROLE_CREATE',
              description: 'Nuevo rol creado en el sistema.',
            },
            ROLE_UPDATE: {
              action: 'ROLE_UPDATE',
              description: 'El Rol fue actualizado.',
            },
          },
          MODELS: {
            ROLES: 'Roles',
          },
        }),
      },
      {
        provide: RolesController,
        useValue: createMock<RolesController>(),
      },
    ],
  }).compile();

  rolesService = module.get<RolesService>(RolesService);
  prismaService = module.get<PrismaService>(PrismaService);
  rolesController = module.get<RolesController>(RolesController);
  utilService = module.get<UtilsService>(UtilsService);
  logs = module.get<LogsService>(LogsService);
});

describe('RolesService', () => {
  it('servicio conectado', () => {
    expect(rolesService).toBeDefined();
  });
});

describe('RolesService Role-create', () => {
  it('deberia crear un rol correctamente en el sistema.', async () => {
    const serviceResponse = await rolesService.create(createRoleDto, 1);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol creado correctamente.',
    );

    jest.spyOn(rolesController, 'create').mockResolvedValue(genericResponseOK);
    const controllerResponse = await rolesController.create(createRoleDto, 1);

    expect(controllerResponse.data).toStrictEqual(serviceResponse);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Rol creado correctamente.',
    );
    expect(controllerResponse.data.id).toBeDefined();

    // Se crea el rol en BD y luego se guarda junto con su Id para los test posteriores
    roleId = controllerResponse.data.id;
    const log = await prismaService.logs.findMany({
      where: { modelId: roleId },
    });
    await prismaService.logs.delete({ where: { id: log[0].id } });

    await prismaService.roles.delete({ where: { id: roleId } });
    roleId = 0;
  });

  it('deberia de fallar el proceso pero crear el role y luego eliminarlo.', async () => {
    jest.spyOn(prismaService.roles, 'findUnique').mockRejectedValue('error');
    
    try {
      createRoleDto.name = 'test Role create';
      await rolesService.create(createRoleDto, 1);

    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);
      const controllerResponse = await rolesController.create(createRoleDto, 1);

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
    }
  });

  it('deberia crear un rol con permisos asociados en el sistema.', async () => {
    createRoleDto.permissions = [1, 2];
    const serviceResponse = await rolesService.create(createRoleDto, 1);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol creado correctamente.',
    );

    jest.spyOn(rolesController, 'create').mockResolvedValue(genericResponseOK);
    const controllerResponse = await rolesController.create(createRoleDto, 1);

    expect(controllerResponse.data).toStrictEqual(serviceResponse);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Rol creado correctamente.',
    );
    expect(controllerResponse.data.id).toBeDefined();

    // se buscan los logs de auditoria creados por el modelId y se eliminan del sistema.
    roleId = controllerResponse.data.id;
    const log = await prismaService.logs.findMany({
      where: { modelId: roleId },
    });
    await prismaService.logs.delete({ where: { id: log[0].id } });

    // Se crea el rol en BD y luego se guarda junto con su Id para los test posteriores
    role = controllerResponse.data;
  });

  it('deberia fallar al crear un rol ya registrado en el sistema.', async () => {
    try {
      await rolesService.create(createRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);
      const controllerResponse = await rolesController.create(createRoleDto, 1);

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(409);
      expect(controllerResponse.message).toStrictEqual(
        'Existe un registro con la misma información.',
      );
    }
  });

  it('deberia de fallar la creacion del rol.', async () => {
    jest.spyOn(prismaService.roles, 'create').mockRejectedValue('error');
    try {
      await rolesService.create(createRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(rolesController, 'create')
        .mockResolvedValue(genericResponseOK);

      const controllerResponse = await rolesController.create(createRoleDto, 1);

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        'Error interno del servidor',
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
    const controllerResponse = await rolesController.findAll(paginationDto);

    expect(controllerResponse.data).toStrictEqual(serviceResponse);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual('Roles encontrados.');
  });

  it('deberia de fallar al obtener los roles del sistema.', async () => {
    jest.spyOn(prismaService.roles, 'findMany').mockRejectedValue('error');

    try {
      await rolesService.findAll(paginationDto);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'findAll')
        .mockResolvedValue(genericResponseOK);
      const controllerResponse = await rolesController.findAll(paginationDto);

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        'Error interno del servidor',
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

    const controllerResponse = await rolesController.update(
      `${roleId}`,
      updateRoleDto,
      1,
    );

    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Rol actualizado correctamente.',
    );
  });

  it('deberia de actualizar un rol correctamente con permisos asociados.', async () => {
    updateRoleDto.permissions = [1, 3, 5];
    //updateRoleDto.name = 'admin_test';

    const serviceResponse = await rolesService.update(roleId, updateRoleDto, 1);
    //await rolesService.updateRolePermission(roleId, [5]);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Rol actualizado correctamente.',
    );

    jest.spyOn(rolesController, 'update').mockResolvedValue(genericResponseOK);

    const controllerResponse = await rolesController.update(
      `${roleId}`,
      updateRoleDto,
      1,
    );

    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Rol actualizado correctamente.',
    );
  });

  it('deberia de fallar la actualizacion de un rol que ya se encuentra registrado.', async () => {
    try {
      updateRoleDto.name = 'administrador';
      await rolesService.update(roleId, updateRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'update')
        .mockResolvedValue(genericResponseOK);

      const controllerResponse = await rolesController.update(
        `${roleId}`,
        updateRoleDto,
        1,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(409);
      expect(controllerResponse.message).toStrictEqual(
        'Existe un registro con la misma información.',
      );
    }
  });

  it('deberia actualizar el rol correctamente pero fallar la actualizacion de sus permisos.', async () => {
    jest.spyOn(prismaService.rolesPermissions, 'createMany').mockRejectedValue('error');
    updateRoleDto.permissions = [4];
    updateRoleDto.name = 'adminTest role';
    try {
      await rolesService.update(
        roleId,
        updateRoleDto,
        1,
      );
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'update')
        .mockResolvedValue(genericResponseOK);

      const controllerResponse = await rolesController.update(
        `${roleId}`,
        updateRoleDto,
        1,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );

      const log = await prismaService.logs.findMany({
        where: { modelId: roleId },
      });
      if(log.length > 0)
        for(let i = 0; i < log.length; i++)
          await prismaService.logs.delete({ where: { id: log[i].id } });
      
      await prismaService.roles.delete({ where: { id: roleId } });
    }

  });

  it('deberia fallar la actualizacion del rol, error de servidor', async () => {
    jest.spyOn(prismaService.roles, 'update').mockRejectedValue('error');
    updateRoleDto.name = 'adminTest role';
    try {
      await rolesService.update(roleId, updateRoleDto, 1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(rolesController, 'update')
        .mockResolvedValue(genericResponseOK);

      const controllerResponse = await rolesController.update(
        `${roleId}`,
        updateRoleDto,
        1,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        "Error interno del servidor",
      );
    }

    //await rolesService.updateRolePermission(roleId, [5]);
  });

});
