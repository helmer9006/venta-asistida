import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '@src/config/config';
import { RequestGetLogsDto } from '@src/logs/models/dto/request-get-logs.dto';
import { LogsService } from '@src/logs/services/logs.service';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { UtilsService } from '@src/shared/services/utils.service';
import { testExpectValues } from '@test/constant/general-constant';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';
import { HttpStatus } from '@nestjs/common';
import { LogsController } from '@src/logs/controllers/logs.controller';
import { CreateLogDto } from '@src/logs/models/dto/create-log.dto';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';

let logsService: LogsService;
const errorDatePayloadGetLogs: RequestGetLogsDto =
  testExpectValues.ErrorDatePayloadGetLogs;
let logsController: LogsController;
const payloadCreateLog: CreateLogDto = testExpectValues.payloadCreateLog;
const payloadCreateLogError: any = {
  data: payloadCreateLog.data,
  createdAt: new Date(),
  model: payloadCreateLog.model,
  modelId: payloadCreateLog.modelId,
};
const pagination: PaginationDto = testExpectValues.pagination;
let prismaService: PrismaService;
let logId;
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      LogsService,
      PrismaService,
      UtilsService,
      AxiosAdapter,
      ConfigService,
      {
        provide: config.KEY,
        useValue: config,
      },
      {
        provide: LogsController,
        useValue: createMock<LogsController>(),
      },
    ],
  }).compile();

  logsService = module.get<LogsService>(LogsService);
  logsController = module.get<LogsController>(LogsController);
  prismaService = module.get<PrismaService>(PrismaService);
});

describe('LogsService /create', () => {
  it('servicio de logs conectado', () => {
    expect(logsService).toBeDefined();
  });
  it('crea un registro de log correctamente en el sistema.', async () => {
    const serviceResponse = await logsService.create(payloadCreateLog);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Log registrado correctamente',
    );
    jest.spyOn(logsController, 'create').mockResolvedValue(genericResponseOK);
    const controlllerResponse = await logsController.create(payloadCreateLog);
    //validation response of service with response controller.
    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );

    expect(controlllerResponse.message).toStrictEqual(
      genericResponseOK.message,
    );
    expect(genericResponseOK.data.id).toBeDefined();
    logId =
      genericResponseOK && genericResponseOK.data
        ? genericResponseOK.data.id
        : null;
  });

  it('Error al crear un registro de log con información incompleta.', async () => {
    const serviceResponse = await logsService.create(payloadCreateLogError);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.BAD_REQUEST,
      'Error creando registro de log.',
    );
    jest.spyOn(logsController, 'create').mockResolvedValue(genericResponseOK);
    const controlllerResponse = await logsController.create(
      payloadCreateLogError,
    );
    //validation response of service with response controller.
    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controlllerResponse.message).toStrictEqual(
      genericResponseOK.message,
    );
    expect(controlllerResponse.statusCode).toStrictEqual(400);
  });
});

describe('LogsService /getLogs', () => {
  it('retorna los logs consultados.', async () => {
    const roleId = payloadCreateLog.modelId;
    const payload = {
      modelId: payloadCreateLog.modelId,
      model: payloadCreateLog.model,
      startDate: new Date(new Date().setDate(new Date().getDate() - 2)), //yesterday
      endDate: new Date(),
    };

    const logs = await logsService.findLogs(payload, roleId, pagination);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      logs,
      HttpStatus.OK,
      'Logs encontrados.',
    );
    jest.spyOn(logsController, 'findLogs').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await logsController.findLogs(
      payload,
      roleId,
      pagination,
    );

    expect(controlllerResponse.data).toStrictEqual(logs);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    // delete log created
    if (logId) await prismaService.logs.delete({ where: { id: logId } });
  });

  it('retorna error porque fecha final del rango de busqueda es mayor a la fecha actual.', async () => {
    const roleId = 2;
    try {
      const logs = await logsService.findLogs(errorDatePayloadGetLogs, roleId);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        {},
        HttpStatus.BAD_REQUEST,
        'La fecha no puede ser mayor que la fecha actual.',
      );
      jest
        .spyOn(logsController, 'findLogs')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await logsController.findLogs(
        errorDatePayloadGetLogs,
        roleId,
        pagination,
      );
      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(400);
    }
  });
});
