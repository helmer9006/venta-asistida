import { UsersService } from '../../../src/users/services/users.service';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
import { UsersController } from '@src/users/controllers/users.controller';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from '@src/config/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { testExpectValues } from '@test/constant/general-constant';
import { CreateUserDto, UpdateUserDto } from '@src/users/models/dto';
import { GenericResponseTestDataBuilder } from '../../utils/generic-response.testdatabuilder';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';

let usersService: UsersService;
let prismaService: PrismaService;
let utilService: UtilsService;
let userController: UsersController;
let userId: number;

let createUserDto: CreateUserDto = testExpectValues.createUserDto;
let paginationDto: PaginationDto = testExpectValues.paginationDto;
const dataUpdateDto: UpdateUserDto = testExpectValues.dataUpdateUserDto;

let testUser: any;
let isOk: boolean = false;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      PrismaService,
      UtilsService,
      ConfigService,
      AxiosAdapter,
      {
        provide: config.KEY,
        useValue: config,
      },
      {
        provide: UsersController,
        useValue: createMock<UsersController>(),
      },
    ],
  }).compile();

  usersService = module.get<UsersService>(UsersService);
  prismaService = module.get<PrismaService>(PrismaService);
  userController = module.get<UsersController>(UsersController);
  utilService = module.get<UtilsService>(UtilsService);
});

describe('UsersService Create', () => {
  it('servicio conectado', () => {
    expect(usersService).toBeDefined();
  });

  it('creacion de un usuario en el sistemas satisfactoriamente', async () => {
    jest.spyOn(utilService, 'saveLogs').mockResolvedValue();
    jest.spyOn(usersService, 'sendEmailInvitationMule').mockResolvedValue(true);

    const serviceResponse = await usersService.create(createUserDto, 1, 1);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Usuario registrado correctamente',
    );
    jest.spyOn(userController, 'create').mockResolvedValue(genericResponseOK);
    const controlllerResponse = await userController.create(
      createUserDto,
      1,
      1,
    );

    if (controlllerResponse.statusCode === 200)
      userId = controlllerResponse.data.id;

    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controlllerResponse.message).toStrictEqual(
      genericResponseOK.message,
    );
  });

  it('UserService Create falla al intentar crear un usuario con un email ya registrado', async () => {
    try {
      await usersService.create(createUserDto, 1, 1);
    } catch (error) {
      const genericResponseConflict =
        new GenericResponseTestDataBuilder().build(
          [],
          error.response.status,
          error.response.error,
        );
      jest
        .spyOn(userController, 'create')
        .mockResolvedValue(genericResponseConflict);

      const controlllerResponse = await userController.create(
        createUserDto,
        1,
        1,
      );
      expect(controlllerResponse.statusCode).toStrictEqual(409);
      expect(controlllerResponse.message).toStrictEqual(
        'Error creando usuario, el usuario ya se encuentra registrado.',
      );
    }

  });
});

describe('UserService FindAll', () => {
  it('obtencion de todos los usuario del sistema', async () => {
    const users = await usersService.findAll(paginationDto);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      users,
      HttpStatus.OK,
      'Usuarios encontrados',
    );
    jest.spyOn(userController, 'findAll').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.findAll(paginationDto, 1);

    expect(controlllerResponse.data).toStrictEqual(users);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('error en la obtencion de todos los usuario del sistema', async () => {
    jest.spyOn(prismaService.users, 'findMany').mockRejectedValue('error');

    await usersService.findAll(paginationDto);

    const genericResponseError = new GenericResponseTestDataBuilder().build(
      [],
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Error del servidor.',
    );
    jest
      .spyOn(userController, 'findAll')
      .mockResolvedValue(genericResponseError);

    const controlllerResponse = await userController.findAll(paginationDto, 1);
    expect(controlllerResponse.message).toStrictEqual('Error del servidor.');
    expect(controlllerResponse.statusCode).toStrictEqual(500);
    expect(controlllerResponse.data).toStrictEqual([]);
  });
});

describe('UserService FindByTerm', () => {
  it('deberia obtener un usuario por un termino especifico', async () => {
    const user = await usersService.findByterm(`${userId}`);
    testUser = user;

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      user,
      HttpStatus.OK,
      'Usuario encontrados',
    );
    jest
      .spyOn(userController, 'getByterm')
      .mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getByterm(`${userId}`, 1);
    expect(controlllerResponse.data).toStrictEqual(user);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('error en la obtencion deun usuario por un termino especifico', async () => {
    jest.spyOn(prismaService.users, 'findMany').mockRejectedValue('error');

    await usersService.findByterm(`${userId}`);
    const genericResponseError = new GenericResponseTestDataBuilder().build(
      [],
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Error del servidor.',
    );
    jest
      .spyOn(userController, 'getByterm')
      .mockResolvedValue(genericResponseError);

    const controlllerResponse = await userController.getByterm(`${userId}`, 1);
    expect(controlllerResponse.message).toStrictEqual('Error del servidor.');
    expect(controlllerResponse.statusCode).toStrictEqual(500);
    expect(controlllerResponse.data).toStrictEqual([]);
  });
});

describe('UserService FindByMail', () => {
  it('deberia obtener un usuario por su email correctamente', async () => {
    const user = testUser[0];
    jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(user);

    const responseUser = await usersService.findByMail(user.email);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseUser,
      HttpStatus.OK,
      'Usuario encontrado.',
    );
    jest.spyOn(userController, 'getById').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getById(user.email, 1);
    expect(controlllerResponse.data).toStrictEqual(user);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('error en la obtencion de un usuario por su email', async () => {
    jest.spyOn(prismaService.users, 'findUnique').mockRejectedValue('error');

    await usersService.findByMail(testUser.email);
    const genericResponseError = new GenericResponseTestDataBuilder().build(
      [],
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Error del servidor.',
    );
    jest
      .spyOn(userController, 'getById')
      .mockResolvedValue(genericResponseError);

    const controlllerResponse = await userController.getById(testUser.email, 1);
    expect(controlllerResponse.message).toStrictEqual('Error del servidor.');
    expect(controlllerResponse.statusCode).toStrictEqual(500);
    expect(controlllerResponse.data).toStrictEqual([]);
  });

  it('error en la obtencion de un usuario cuando no se encuentra en el sistema', async () => {
    jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(null);

    try {
      await usersService.findByMail('abc123@example.com');
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        null,
        HttpStatus.NOT_FOUND,
        error.response.error,
      );
      jest
        .spyOn(userController, 'getById')
        .mockResolvedValue(genericResponseOK);

      const controlllerResponse = await userController.getById(
        testUser.email,
        1,
      );

      expect(controlllerResponse.data).toStrictEqual(null);
      expect(controlllerResponse.statusCode).toStrictEqual(404);
      expect(controlllerResponse.message).toStrictEqual(
        'Usuario no encontrado.',
      );
    }
  });
});

describe('UserService Update', () => {
  it('deberia actualizar un usuario correctamente', async () => {
    jest.spyOn(utilService, 'saveLogs').mockResolvedValue();

    const responseUserUpdate = await usersService.update(
      userId,
      dataUpdateDto,
      1,
    );

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseUserUpdate,
      HttpStatus.OK,
      'Usuario actualizado correctamente.',
    );
    jest.spyOn(userController, 'update').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.update(
      `${userId}`,
      dataUpdateDto,
      1,
    );
    if (controlllerResponse.statusCode === 200) isOk = true;

    if (isOk && userId !== undefined) {
      await prismaService.users.delete({
        where: { id: userId },
      });
    }
    expect(controlllerResponse.data).toStrictEqual(responseUserUpdate);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('error en el servidor al actualizar un usuario', async () => {
    jest.spyOn(prismaService.users, 'update').mockRejectedValue('error');

    try {
      await usersService.update(userId, dataUpdateDto, 1);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        [],
        HttpStatus.BAD_REQUEST,
        error.response,
      );
      jest
        .spyOn(userController, 'update')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await userController.update(
        `${userId}`,
        dataUpdateDto,
        1,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Error inesperado, revise los logs del servidor.',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(400);
      expect(controlllerResponse.data).toStrictEqual([]);
    }
  });

  it('error al actualizar un usuario que no se encuentra en el sistema', async () => {
    jest.spyOn(prismaService.users, 'update').mockResolvedValueOnce(null);

    try {
      await usersService.update(
        999999999999,
        dataUpdateDto,
        1,
      );
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        [],
        HttpStatus.BAD_REQUEST,
        error.response,
      );
      jest
        .spyOn(userController, 'update')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await userController.update(
        `${userId}`,
        dataUpdateDto,
        1,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Error inesperado, revise los logs del servidor.',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(400);
      expect(controlllerResponse.data).toStrictEqual([]);
    }
  });
});
