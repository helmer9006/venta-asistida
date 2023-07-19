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

// Inyeccion de dependencias y providers necesarios para ejecutar el servicio

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

describe('UsersService User-create', () => {
  it('servicio conectado', () => {
    expect(usersService).toBeDefined();
  });

  it('deberia crear un usuario correctamente en el sistema.', async () => {
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
    
    // Crea el usuario en la BD y obtiene su Id para usarlo en los test posteriores
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

  it('deberia de fallar la creacion del usuario por que el email ya esta registrado.', async () => {
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

describe('UserService Users-findAll', () => {
  it('deberia obtener los usuarios del sistema.', async () => {
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

  it('deberia fallar al obtener los usuarios del sistema.', async () => {
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

describe('UserService Users-findByTerm', () => {
  it('deberia obtener un usuario por un termino especifico.', async () => {
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

  it('deberia fallar al obtener un usuario por un termino especifico.', async () => {
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

describe('UserService Users-findByMail', () => {
  it('deberia obtener un usuario por su email.', async () => {
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

  it('deberia fallar al obtener un usuario por su email.', async () => {
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

  it('deberia fallar al obtener un usuario por su email no registrado.', async () => {
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

describe('UserService Users-update', () => {
  it('deberia actualizar un usuario correctamente en el sistema', async () => {
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

    // Si todos los test resultan bien, elimina el usuario creado para las pruebas de la BD.
    if (isOk && userId !== undefined) {
      await prismaService.users.delete({
        where: { id: userId },
      });
    }
    expect(controlllerResponse.data).toStrictEqual(responseUserUpdate);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia fallar la actualizacion de un usuario.', async () => {
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

  it('deberia fallar la actualizacion de un usuario no registrado', async () => {
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
