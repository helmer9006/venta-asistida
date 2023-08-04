import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AlliesAdvisorController } from '@src/allies-advisor/controllers/allies-advisor.controller';
import { AlliesAdvisorService } from '@src/allies-advisor/services/allies-advisor.service';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { testExpectValues } from '@test/constant/general-constant';
import { HttpStatus } from '@nestjs/common';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';
import { UtilsService } from '@src/shared/services/utils.service';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';

let alliesAdvController: AlliesAdvisorController;
let alliesAdvService: AlliesAdvisorService;
let prismaService: PrismaService;
const payloadCreateAlliesAdvisor = testExpectValues.payloadCreateAlliesAdvisor;
const payloadAdvisorId = testExpectValues.payloadAdvisorId;
const payloadCreateAlliesAdvisorError =
  testExpectValues.payloadCreateAlliesAdvisorError;
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PrismaService,
      AlliesAdvisorService,
      UtilsService,
      ConfigService,
      AxiosAdapter,
      {
        provide: AlliesAdvisorController,
        useValue: createMock<AlliesAdvisorController>(),
      },
    ],
  }).compile();

  alliesAdvService = module.get<AlliesAdvisorService>(AlliesAdvisorService);
  alliesAdvController = module.get<AlliesAdvisorController>(
    AlliesAdvisorController,
  );
  prismaService = module.get<PrismaService>(PrismaService);
});

describe('AlliesAdvisorService /create', () => {
  it('servicio de aliado por asesor iniciado', () => {
    expect(alliesAdvService).toBeDefined();
  });

  it('crea correctamente en el sistema un registro de aliados asociado a un asesor.', async () => {
    let alliesAdvId: number;
    const serviceResponse = await alliesAdvService.create(
      payloadCreateAlliesAdvisor,
    );
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Registrado correctamente',
    );
    console.log('genericResponseOK', genericResponseOK);
    jest
      .spyOn(alliesAdvController, 'create')
      .mockResolvedValue(genericResponseOK);
    const controllerResponse = await alliesAdvController.create(
      payloadCreateAlliesAdvisor,
    );
    console.log('controllerResponse', controllerResponse);
    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controllerResponse.message).toStrictEqual(genericResponseOK.message);
    expect(genericResponseOK.data.count).toBeGreaterThan(0);
  });

  it('Error cuando se intenta agregar un aliado a un asesor que ya está agregado.', async () => {
    try {
      await alliesAdvService.create(payloadCreateAlliesAdvisorError);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      console.log('genericResponseOK', genericResponseOK);
      jest
        .spyOn(alliesAdvController, 'create')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await alliesAdvController.create(
        payloadCreateAlliesAdvisor,
      );
      console.log(controlllerResponse);
      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(409);
      expect(controlllerResponse.message).toStrictEqual(
        'Existe un registro con la misma información.',
      );
    }
  });
});

describe('AlliesAdvisorService FindAll by advisorId', () => {
  it('Obtener el listado de aliados asociados al asesor.', async () => {
    const responseService = await alliesAdvService.findAll(
      payloadCreateAlliesAdvisor[0].advisorId,
    );
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseService,
      HttpStatus.OK,
      'Registros encontrados.',
    );
    jest
      .spyOn(alliesAdvController, 'findAll')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await alliesAdvController.findAll(
      payloadCreateAlliesAdvisor[0].advisorId.toString(),
    );

    expect(controllerResponse.data).toStrictEqual(responseService);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual('Registros encontrados.');
  });

  it('deberia fallar al consultar registro de aliados asociados a un asesor.', async () => {
    jest.spyOn(prismaService, '$queryRaw').mockRejectedValue('error');

    try {
      await alliesAdvService.findAll(Number(payloadAdvisorId));
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );

      jest
        .spyOn(alliesAdvController, 'findAll')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await alliesAdvController.findAll(
        payloadAdvisorId,
      );

      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
    }
  });
});

describe('AlliesAdvisorService Delete by advisorId', () => {
  it('Eliminar registro de aliado asociado a asesor.', async () => {
    // delete aliesAdvisor created
    const reg = await prismaService.alliesAdvisor.findMany({
      where: {
        allyId: payloadCreateAlliesAdvisor[0].allyId,
        advisorId: payloadCreateAlliesAdvisor[0].advisorId,
      },
    });
    console.log('reg', reg);
    const responseService = await alliesAdvService.remove(reg[0].id);
    console.log(responseService);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      {},
      HttpStatus.OK,
      'Registro eliminado correctamente.',
    );
    jest
      .spyOn(alliesAdvController, 'remove')
      .mockResolvedValue(genericResponseOK);

    const controllerResponse = await alliesAdvController.remove(
      reg[0].id.toString(),
    );
    console.log('delete controllerResponse', controllerResponse);
    expect(controllerResponse.data).toStrictEqual({});
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual(
      'Registro eliminado correctamente.',
    );
  });

  it('deberia fallar al eliminar registro de aliado asigando a asesor porque no existe.', async () => {
    const id = '9999999999';
    jest
      .spyOn(prismaService.alliesAdvisor, 'delete')
      .mockRejectedValue('error');

    try {
      await alliesAdvService.remove(Number(id));
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      console.log('genericResponseOK', genericResponseOK);
      jest
        .spyOn(alliesAdvController, 'remove')
        .mockResolvedValue(genericResponseOK);
      const controlllerResponse = await alliesAdvController.remove(id);
      console.log(controlllerResponse);
      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
    }
  });
});
