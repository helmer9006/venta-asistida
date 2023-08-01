import { UsersService } from '@src/users/services/users.service';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
import { UsersController } from '@src/users/controllers/users.controller';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from '@src/config/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { testExpectValues } from '@test/constant/general-constant';
import { CreateUserDto, UpdateUserDto } from '@src/users/models/dto';
import { GenericResponseTestDataBuilder } from '@test/utils/generic-response.testdatabuilder';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from '@src/shared/models/dto/pagination-user.dto';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { LogsService } from '@src/logs/services/logs.service';
import { AuthService } from '@src/auth/services/auth.service';

let usersService: UsersService;
let prismaService: PrismaService;
let utilService: UtilsService;
let userController: UsersController;
let configService: ConfigService;
let configuration: ConfigType<typeof config>;
let logs: LogsService;
let userId: number;

const createUserDto: CreateUserDto = testExpectValues.createUserDto;
const paginationDto: PaginationDto = testExpectValues.paginationDto;
const dataUpdateDto: UpdateUserDto = testExpectValues.dataUpdateUserDto;

let testUser: any;
let isOk = false;

// Inyeccion de dependencias y providers necesarios para ejecutar el servicio

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      PrismaService,
      ConfigService,
      UtilsService,
      AxiosAdapter,
      AuthService,
      LogsService,
      {
        provide: config.KEY,
        useValue: createMock<typeof configuration>({
          AUDIT_ACTIONS: {
            USER_CREATE: {
              action: 'USER_CREATE',
              description: 'Nuevo usuario creado en el sistema.',
            },
            USER_UPDATE: {
              action: 'USER_UPDATE',
              description: 'El usuario fue actualizado',
            },
          },
          MODELS: {
            USERS: 'Users',
          },
        }),
      },
      // {
      //   provide: ConfigService,
      //   useValue: createMock<ConfigService>({
      //     get: jest.fn((key) => {
      //       switch (key) {
      //         case 'MULE_CLIENT_ID_METHOD':
      //           return client_id;
      //         default:
      //           return null;
      //       }
      //     }),
      //   }),
      // },
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
  logs = module.get<LogsService>(LogsService);
});

describe('users', () => {
  it('servicio conectado', () => {
    expect(usersService).toBeDefined();
  });
});

describe('UsersService User-create', () => {
  it('deberia crear un usuario correctamente en el sistema.', async () => {
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

    expect(controlllerResponse.data).toStrictEqual(genericResponseOK.data);
    expect(controlllerResponse.statusCode).toStrictEqual(
      genericResponseOK.statusCode,
    );
    expect(controlllerResponse.message).toStrictEqual(
      genericResponseOK.message,
    );
    expect(controlllerResponse.data.id).toBeDefined();

    // Crea el usuario en la BD y obtiene su Id para usarlo en los test posteriores
    userId = controlllerResponse.data.id;
    testUser = controlllerResponse.data;
      console.log(userId, testUser);
    const log = await prismaService.logs.findMany({
      where: { modelId: userId },
    });
    await prismaService.logs.delete({ where: { id: log[0].id } });
  });

  it('deberia de fallar la creacion del usuario por que el email ya esta registrado.', async () => {
    try {
      await usersService.create(createUserDto, 1, 1);
    } catch (error) {
      const genericResponseConflict =
        new GenericResponseTestDataBuilder().build(
          [],
          error.statusCode,
          error.message,
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
        'Existe un registro con la misma información.',
      );
    }
  });

  it('deberia de fallar la creacion del usuario, error interno del servidor', async () => {
    jest.spyOn(prismaService.users, 'create').mockRejectedValue('error');
    try {
      await usersService.create(createUserDto, 1, 1);
    } catch (error) {
      const genericResponseConflict =
        new GenericResponseTestDataBuilder().build(
          error.data,
          error.statusCode,
          error.message,
        );
      jest
        .spyOn(userController, 'create')
        .mockResolvedValue(genericResponseConflict);

      const controlllerResponse = await userController.create(
        createUserDto,
        1,
        1,
      );
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
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
      'Usuarios encontrados.',
    );
    jest.spyOn(userController, 'findAll').mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.findAll(paginationDto, 1);

    expect(controlllerResponse.data).toStrictEqual(users);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia fallar al obtener los usuarios del sistema.', async () => {
    jest.spyOn(prismaService.users, 'findMany').mockRejectedValue('error');
    try {
      await usersService.findAll(paginationDto);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(userController, 'findAll')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await userController.findAll(
        paginationDto,
        1,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.data).toStrictEqual({});
    }
  });
});

describe('UserService Users-findByTerm', () => {
  it('deberia obtener un usuario por un termino especifico, por identificacion', async () => {
    const user = await usersService.findByterm(
      `${testUser.identification}`,
      paginationDto,
    );
    // testUser = user;

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      user,
      HttpStatus.OK,
      'Usuario encontrado.',
    );
    jest
      .spyOn(userController, 'getByterm')
      .mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getByterm(
      `${testUser.identification}`,
      paginationDto,
    );
    expect(controlllerResponse.data).toStrictEqual(user);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia obtener un usuario por un termino especifico, por nombre', async () => {
    const user = await usersService.findByterm(
      `${testUser.name}`,
      paginationDto,
    );

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      user,
      HttpStatus.OK,
      'Usuario encontrado.',
    );
    jest
      .spyOn(userController, 'getByterm')
      .mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getByterm(
      `${testUser.name}`,
      paginationDto,
    );
    expect(controlllerResponse.data).toStrictEqual(user);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia fallar al obtener un usuario por un termino especifico.', async () => {
    jest.spyOn(prismaService.users, 'findMany').mockRejectedValue('error');

    try {
      await usersService.findByterm(`${testUser.name}`, paginationDto);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(userController, 'getByterm')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await userController.getByterm(
        `${testUser.name}`,
        paginationDto,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.data).toStrictEqual({});
    }
  });
});

describe('UserService Users-findByMail', () => {
  it('deberia obtener un usuario por su email.', async () => {
    testUser.roles = testExpectValues.rolesUserfindByEmail;
    parseInt(testUser.roles.createdAt);
    testUser.supervisor = null;
    const user = testUser;
    const responseUser = await usersService.findByMail(user.email);
    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      responseUser,
      HttpStatus.OK,
      'Usuario encontrado.',
    );
    jest
      .spyOn(userController, 'getByEmail')
      .mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getByEmail(user.email, 1);
    expect(controlllerResponse.data).toStrictEqual(user);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia fallar al obtener un usuario por su email.', async () => {
    jest.spyOn(prismaService.users, 'findUnique').mockRejectedValue('error');

    try {
      await usersService.findByMail(testUser.email);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(userController, 'getByEmail')
        .mockResolvedValue(genericResponseError);

      const controlllerResponse = await userController.getByEmail(
        testUser.email,
        1,
      );
      expect(controlllerResponse.message).toStrictEqual(
        'Error interno del servidor',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.data).toStrictEqual({});
    }
  });

  it('deberia fallar al obtener un usuario por su email no registrado.', async () => {
    jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(null);

    try {
      await usersService.findByMail('abc123@example.com');
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(userController, 'getByEmail')
        .mockResolvedValue(genericResponseOK);

      const controlllerResponse = await userController.getByEmail(
        testUser.email,
        1,
      );
      expect(controlllerResponse.data).toStrictEqual({});
      expect(controlllerResponse.statusCode).toStrictEqual(404);
      expect(controlllerResponse.message).toStrictEqual(
        'Usuario no encontrado',
      );
    }
  });
});

describe('UserService Users-update', () => {
  it('deberia actualizar un usuario correctamente en el sistema', async () => {
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

    expect(controlllerResponse.data).toStrictEqual(responseUserUpdate);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
    expect(userId).toBeDefined();
    expect(isOk).toStrictEqual(true);

    // Si todos los test resultan bien, elimina el log de auditoria y  usuario creado para las pruebas de la BD.
    const log = await prismaService.logs.findMany({
      where: { modelId: userId },
    });
    await prismaService.logs.delete({ where: { id: log[0].id } });

    await prismaService.users.delete({
      where: { id: userId },
    });
  });

  it('deberia fallar la actualizacion de un usuario, error de servidor', async () => {
    jest.spyOn(prismaService.users, 'update').mockRejectedValue('error');

    try {
      await usersService.update(userId, dataUpdateDto, 1);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
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
        'Error interno del servidor',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.data).toStrictEqual({});
    }
  });

  it('deberia fallar la actualizacion de un usuario no registrado', async () => {
    jest.spyOn(prismaService.users, 'update').mockResolvedValueOnce(null);

    try {
      await usersService.update(null, dataUpdateDto, 1);
    } catch (error) {
      const genericResponseError = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
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
        'El usuario no pudo ser actualizado.',
      );
      expect(controlllerResponse.statusCode).toStrictEqual(404);
      expect(controlllerResponse.data).toStrictEqual({});
    }
  });
});

describe('UserSErvice, findByRoleId', () => {
  it('deberia obtener una lista de usuarios por su rol.', async () => {
    const serviceResponse = await usersService.findByRoleId(1, paginationDto);

    const genericResponseOK = new GenericResponseTestDataBuilder().build(
      serviceResponse,
      HttpStatus.OK,
      'Usuario actualizado correctamente.',
    );
    jest
      .spyOn(userController, 'getByRolId')
      .mockResolvedValue(genericResponseOK);

    const controlllerResponse = await userController.getByRolId(
      `1`,
      paginationDto,
    );

    expect(controlllerResponse.data).toStrictEqual(serviceResponse);
    expect(controlllerResponse.statusCode).toStrictEqual(200);
  });

  it('deberia fallar al obtener una lista de usuarios por su rol, error de servidor', async () => {
    jest.spyOn(prismaService.users, 'findMany').mockRejectedValue('error');
    try {
      const serviceResponse = await usersService.findByRoleId(1, paginationDto);
    } catch (error) {
      const genericResponseOK = new GenericResponseTestDataBuilder().build(
        error.data,
        error.statusCode,
        error.message,
      );
      jest
        .spyOn(userController, 'getByRolId')
        .mockResolvedValue(genericResponseOK);

      const controlllerResponse = await userController.getByRolId(
        `1`,
        paginationDto,
      );

      expect(controlllerResponse.data).toStrictEqual([]);
      expect(controlllerResponse.statusCode).toStrictEqual(500);
      expect(controlllerResponse.message).toStrictEqual(
        'Error de servidor al consultar usuarios.',
      );
    }
  });
});
