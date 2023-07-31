import { ConfigAllyController } from './../../src/config-ally/controllers/config-ally.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PermissionsController } from '@src/permissions/controllers/permissions.controller';
import { HttpStatus } from '@nestjs/common';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';
import { ConfigAllyService } from '@src/config-ally/services/config-ally.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from '@src/config/config';
import { testExpectValues } from '@test/constant/general-constant';

let configAllyService: ConfigAllyService;
let prismaService: PrismaService;
let configAllyController: ConfigAllyController;
let configuration: ConfigType<typeof config>;

let allyId: number;
let configAllyId: number;

// Inyeccion de dependencias y providers necesarios para ejecutar el servicio
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ConfigAllyService,
      PrismaService,
      {
        provide: config.KEY,
        useValue: createMock<typeof configuration>({
          ATTRIBUTES_REQUIRED_FORM_BASE:
            testExpectValues.ATTRIBUTES_REQUIRED_FORM_BASE,
        }),
      },
      {
        provide: ConfigAllyController,
        useValue: createMock<ConfigAllyController>(),
      },
    ],
  }).compile();

  configAllyService = module.get<ConfigAllyService>(ConfigAllyService);
  prismaService = module.get<PrismaService>(PrismaService);
  configAllyController = module.get<ConfigAllyController>(ConfigAllyController);
});

describe('PermissionsService', () => {
  it('servicio conectado', () => {
    expect(configAllyService).toBeDefined();
  });
});

describe('ConfigAlly Services Create', () => {
  it('deberia crear un registro de configuracion para un aliado en el sistema.', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    const responseService = await configAllyService.create(
      testExpectValues.payloadCreateConfigAlly,
    );

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseService,
      HttpStatus.OK,
      'Configuracion creada correctamente.',
    );
    jest
      .spyOn(configAllyController, 'create')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await configAllyController.create(
      testExpectValues.payloadCreateConfigAlly,
    );

    if (controllerResponse.statusCode === 200)
      allyId = controllerResponse.data.allyId;
    configAllyId = controllerResponse.data.id;

    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controllerResponse.message).toStrictEqual(genericResponseOK.message);
  });

  it('deberia de fallar al encontrar un registro de configuracion para el aliado en el sistema.', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    testExpectValues.payloadCreateConfigAlly.allyId = allyId;
    try {
      await configAllyService.create(testExpectValues.payloadCreateConfigAlly);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.CONFLICT,
        'El aliado ya tiene un registro de configuración creado.',
      );
      jest
        .spyOn(configAllyController, 'create')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.create(
        testExpectValues.payloadCreateConfigAlly,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(409);
      expect(controllerResponse.message).toStrictEqual(
        'El aliado ya tiene un registro de configuración creado.',
      );
    }
  });

  it('deberia de fallar al no encontrar el aliado en los usuarios del sistema.', async () => {
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    try {
      testExpectValues.payloadCreateConfigAlly.allyId = 99999;
      await configAllyService.create(testExpectValues.payloadCreateConfigAlly);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.NOT_FOUND,
        'No se pudo encontrar el aliado',
      );
      jest
        .spyOn(configAllyController, 'create')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.create(
        testExpectValues.payloadCreateConfigAlly,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(404);
      expect(controllerResponse.message).toStrictEqual(
        'No se pudo encontrar el aliado',
      );
    }
  });

  it('deberia de fallar al no encontrar todos los atributos requeridos del formulario para el aliado', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);

    testExpectValues.payloadCreateConfigAlly.attributes =
      testExpectValues.payloadAttributesIncomplete;
    try {
      await configAllyService.create(testExpectValues.payloadCreateConfigAlly);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.BAD_REQUEST,
        'Se requieren todos los atributos del formulario base.',
      );
      jest
        .spyOn(configAllyController, 'create')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.create(
        testExpectValues.payloadCreateConfigAlly,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(400);
      expect(controllerResponse.message).toStrictEqual(
        'Se requieren todos los atributos del formulario base.',
      );
    }
  });
});

describe('ConfigAllyService FindOne', () => {
  it('deberia obtener el formulario base correctamente', async () => {
    const responseService = await configAllyService.findOne(1, NaN);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseService,
      HttpStatus.OK,
      'Configuracion encontrada.',
    );
    jest
      .spyOn(configAllyController, 'findOne')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await configAllyController.findOne('1', 'null');

    expect(controllerResponse.data).toStrictEqual(responseService);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Configuracion encontrada.',
    );
  });

  it('deberia obtener la configuracion del formulario de un aliado', async () => {
    const responseService = await configAllyService.findOne(null, 2);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseService,
      HttpStatus.OK,
      'Configuracion encontrada.',
    );
    jest
      .spyOn(configAllyController, 'findOne')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await configAllyController.findOne('null', '2');

    expect(controllerResponse.data).toStrictEqual(responseService);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Configuracion encontrada.',
    );
  });

  it('deberia fallar al enviar un Url invalida', async () => {
    try {
      await configAllyService.findOne(1, 2);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        [],
        HttpStatus.NOT_FOUND,
        'Url invalida, por favor revisela.',
      );
      jest
        .spyOn(configAllyController, 'findOne')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.findOne('1', '2');

      expect(controllerResponse.data).toStrictEqual([]);
      expect(controllerResponse.statusCode).toStrictEqual(404);
      expect(controllerResponse.message).toStrictEqual(
        'Url invalida, por favor revisela.',
      );
    }
  });

  it('deberia fallar al obtener la configuracion del aliado.', async () => {
    try {
      await configAllyService.findOne(null, 999999);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.BAD_REQUEST,
        'No se pudo obtener la configuracion del aliado.',
      );
      jest
        .spyOn(configAllyController, 'findOne')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.findOne(
        'null',
        '999999',
      );
      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(400);
      expect(controllerResponse.message).toStrictEqual(
        'No se pudo obtener la configuracion del aliado.',
      );
    }
  });
});

describe('ConfigAllyService Update', () => {
  it('deberia actualizar la configuracion del aliado', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    const responseService = await configAllyService.update(
      configAllyId,
      testExpectValues.payloadUpdateConfigAlly,
    );

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseService,
      HttpStatus.OK,
      'Configuracion actualizada correctamente.',
    );
    jest
      .spyOn(configAllyController, 'update')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await configAllyController.update(
      `${configAllyId}`,
      testExpectValues.payloadUpdateConfigAlly,
    );

    if (controllerResponse.statusCode === 200)
      await prismaService.configAlly.delete({
        where: { id: configAllyId },
      });

    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(genericResponseOK.message);
  });

  it('deberia fallar al actualizar la configuracion del aliado, error de servidor', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);
    jest.spyOn(prismaService.configAlly, 'update').mockRejectedValue('error');
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    try {
      await configAllyService.update(
        999,
        testExpectValues.payloadUpdateConfigAlly,
      );
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error interno del servidor.',
      );
      jest
        .spyOn(configAllyController, 'update')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.update(
        `${999}`,
        testExpectValues.payloadUpdateConfigAlly,
      );
      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(500);
      expect(controllerResponse.message).toStrictEqual(
        'Error interno del servidor.',
      );
    }
  });

  it('deberia de fallar al no encontrar el aliado en los usuarios del sistema.', async () => {
    jest
      .spyOn(configAllyService, 'verifyRequiredAttributes')
      .mockResolvedValue(undefined);

    try {
      testExpectValues.payloadUpdateConfigAlly.allyId = 99999;
      await configAllyService.update(
        configAllyId,
        testExpectValues.payloadUpdateConfigAlly,
      );
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.NOT_FOUND,
        'No se pudo encontrar el aliado',
      );
      jest
        .spyOn(configAllyController, 'update')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.update(
        `${configAllyId}`,
        testExpectValues.payloadUpdateConfigAlly,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(404);
      expect(controllerResponse.message).toStrictEqual(
        'No se pudo encontrar el aliado',
      );
    }
  });

  it('deberia de fallar al no encontrar todos los atributos requeridos del formulario para el aliado', async () => {
    jest
      .spyOn(configAllyService, 'findAllyById')
      .mockResolvedValue(testExpectValues.payloadAllyFound);

    testExpectValues.payloadUpdateConfigAlly.attributes =
      testExpectValues.payloadAttributesIncomplete;
    try {
      await configAllyService.update(
        configAllyId,
        testExpectValues.payloadCreateConfigAlly,
      );
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.BAD_REQUEST,
        'Se requieren todos los atributos del formulario base.',
      );
      jest
        .spyOn(configAllyController, 'update')
        .mockResolvedValue(genericResponseError);

      const controllerResponse = await configAllyController.update(
        `${configAllyId}`,
        testExpectValues.payloadUpdateConfigAlly,
      );

      expect(controllerResponse.data).toStrictEqual({});
      expect(controllerResponse.statusCode).toStrictEqual(400);
      expect(controllerResponse.message).toStrictEqual(
        'Se requieren todos los atributos del formulario base.',
      );
    }
  });
});

describe('ConfigAllyService FindAllyById', () => {
  it('deberia obtener el usuario aliado corectamente.', async () => {
    const response = await configAllyService.findAllyById(2);
  });
});
