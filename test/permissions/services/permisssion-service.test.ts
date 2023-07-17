import { PrismaService } from '@src/prisma/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PermissionsService } from '@src/permissions/services/permissions.service';
import { PermissionsController } from '@src/permissions/controllers/permissions.controller';
import { HttpStatus } from '@nestjs/common';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';

let permissionsService: PermissionsService;
let prismaService: PrismaService;
let permissionsController: PermissionsController;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PermissionsService,
      PrismaService,
      {
        provide: PermissionsController,
        useValue: createMock<PermissionsController>(),
      },
    ],
  }).compile();

  permissionsService = module.get<PermissionsService>(PermissionsService);
  prismaService = module.get<PrismaService>(PrismaService);
  permissionsController = module.get<PermissionsController>(
    PermissionsController,
  );
});

describe('PermissionsService', () => {
  it('servicio conectado', () => {
    expect(permissionsService).toBeDefined();
  });
});

describe('PermissionsService', () => {
  it('FindAll', async () => {
    const serviceResponse = await permissionsService.findAll();

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Permisos encontrados.',
    );

    jest
      .spyOn(permissionsController, 'findAll')
      .mockResolvedValue(genericResponseOK);
    const controlllerResponse = await permissionsController.findAll();

    expect(controlllerResponse.data).toStrictEqual(serviceResponse);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual('Permisos encontrados.');
  });

  it('FindAll falla', async () => {
    jest.spyOn(prismaService.permissions, 'findMany').mockRejectedValue('error')

    try {
      await permissionsService.findAll();
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        [],
        error.response.statusCode,
        error.response.message,
      );
  
      jest
        .spyOn(permissionsController, 'findAll')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await permissionsController.findAll();
  
      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual('Error consultando permisos.');
    }

    
  });
});

describe('PermissionsService', () => {
  it('findPermissionsByRole ', async () => {
    const serviceResponse = await permissionsService.findPermissionsByRole(1);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Permisos encontrados.',
    );

    jest
      .spyOn(permissionsController, 'findAll')
      .mockResolvedValue(genericResponseOK);
    const controlllerResponse = await permissionsController.findAll();

    expect(controlllerResponse.data).toStrictEqual(serviceResponse);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(controlllerResponse.message).toStrictEqual('Permisos encontrados.');
  });

  it('findPermissionsByRole falla', async () => {
    jest.spyOn(prismaService.permissions, 'findMany').mockRejectedValue('error')

    try {
      await permissionsService.findPermissionsByRole(1);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        [],
        error.response.statusCode,
        error.response.message,
      );
  
      jest
        .spyOn(permissionsController, 'getPermissionsByRole')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await permissionsController.getPermissionsByRole(`${1}`);
  
      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual('Error consultando permisos del rol.');
    }

  });
});
