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
    jest
      .spyOn(alliesAdvController, 'create')
      .mockResolvedValue(genericResponseOK);
    const controllerResponse = await alliesAdvController.create(
      payloadCreateAlliesAdvisor,
    );
    // create register of allies for advisor successfully
    if (controllerResponse.statusCode === 200)
      alliesAdvId = controllerResponse.data.id;
    //validation response of service with response controller.
    expect(controllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controllerResponse.message).toStrictEqual(genericResponseOK.message);
    expect(genericResponseOK.data.id).toBeDefined();
    const id =
      genericResponseOK && genericResponseOK.data
        ? genericResponseOK.data.id
        : null;
    if (id) {
      // delete aliesAdvisor created
      await prismaService.alliesAdvisor.delete({
        where: { id: id },
      });
    }
  });

  it('Error cuando se intenta agregar un aliado a un asesor que ya está agregado.', async () => {
    let serviceResponse, genericResponseOK;
    try {
      serviceResponse = await alliesAdvService.create(
        payloadCreateAlliesAdvisorError,
      );
      genericResponseOK = new GenericResponseTestDataBuilder().build(
        serviceResponse,
        HttpStatus.NOT_FOUND,
        'Existe un registro con la misma información.',
      );
      const id =
        genericResponseOK && genericResponseOK.data
          ? genericResponseOK.data.id
          : null;
      if (id) {
        // delete aliesAdvisor created
        await prismaService.alliesAdvisor.delete({
          where: { id: id },
        });
      }
    } catch (error) {
      //validation response error
      expect(error.statusCode).toStrictEqual(409);
      expect(error.message).toStrictEqual(
        'Existe un registro con la misma información.',
      );
    }
  });
});

describe('AlliesAdvisorService FindAll by advisorId', () => {
  it('Obtener el listado de aliados asociados al asesor.', async () => {
    const responseService = await alliesAdvService.findAll(
      Number(payloadAdvisorId),
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
      payloadAdvisorId,
    );

    expect(controllerResponse.data).toStrictEqual(responseService);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual('Registros encontrados.');
  });
});

describe('AlliesAdvisorService Delete by advisorId', () => {
  it('Eliminar registor de aliado asociado a asesor.', async () => {
    const responseService = await alliesAdvService.remove(
      Number(payloadAdvisorId),
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
      payloadAdvisorId,
    );

    expect(controllerResponse.data).toStrictEqual(responseService);
    expect(controllerResponse.statusCode).toStrictEqual(200);
    expect(controllerResponse.message).toStrictEqual('Registros encontrados.');
  });
});
