import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { ExampleProviderService } from '@src/adapter/example-provider/services/example-provider.service';
import { DummyService } from '@src/dummy/services/dummy.service';

import { GenericResponseTestDataBuilder } from './testdatabuilder/generic-response.testdatabuilder';
import { GeneralTestConstant } from '@test/constant/general-constant';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';
import { UserTestDataBuilder } from './testdatabuilder/user.testdatabuilder';

// https://jestjs.io/docs/api si quieres ser mas pro *guiño guiño*

const MENSAJE_NO_FEATURE_FLAG = 'Not enable feature try again later...';
describe('DummyService Test', () => {
  let dummyService: DummyService;
  let exampleProviderService: ExampleProviderService;
  
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DummyService,
        {
          provide: ExampleProviderService,
          useValue: createMock<ExampleProviderService>(),
        },
        
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>({
            user: {
              findMany: async () => {
                //Pass
              },
              create: async (creationDto: {data: Prisma.UserCreateInput }) => {
                //Pass
              }
            },
          }),
        },
      ],
    }).compile();

    dummyService = moduleRef.get<DummyService>(DummyService);
    exampleProviderService = moduleRef.get<ExampleProviderService>(
      ExampleProviderService,
    );
    
    prismaService =  moduleRef.get<PrismaService>(PrismaService);
  });

  it('Definición del servicio', () => {
    expect(dummyService).toBeDefined();
  });
  
  it('Deberia mostrar mensaje de feature flag habilitada', async () => {
    // arrange
    const flagEnable = true;
    const genericResponseFake = new GenericResponseTestDataBuilder().build();
    
      const getDataFromProviderSpy = jest
      .spyOn(exampleProviderService, 'getDataFromProvider')
      .mockResolvedValue(genericResponseFake);
    //act
    const result: any = await dummyService.dummyServiceExample();
    //assert
    
    expect(getDataFromProviderSpy).toHaveBeenCalledTimes(
      GeneralTestConstant.ONCE,
    );
    expect(result.data).toStrictEqual(genericResponseFake.data);
    expect(result.statusCode).toStrictEqual(genericResponseFake.statusCode);
    expect(result.message).toStrictEqual(genericResponseFake.message);
  });
  
  it('Deberia mostrar mensaje de feature flag deshabilitada', async () => {
    // arrange
    const flagEnable = false;
    
      const getDataFromProviderSpy = jest
      .spyOn(exampleProviderService, 'getDataFromProvider')
      .mockResolvedValue(undefined);
    //act
    const result: any = await dummyService.dummyServiceExample();
    //assert
    
    expect(getDataFromProviderSpy).toHaveBeenCalledTimes(
      GeneralTestConstant.ONCE,
    );
    
  });

  it('Deberia guardar un usuario en la db y mostrar un listado de ellos', async () => {
    // arrange
    const CANTIDAD_REGISTROS = 3;
    const {userId, ...userRequest} = new UserTestDataBuilder().build();
    const users = new UserTestDataBuilder().buildList(CANTIDAD_REGISTROS);
    const findMany = jest
      .spyOn(prismaService.user, 'findMany')
      .mockResolvedValue(users);
    const create = jest
      .spyOn(prismaService.user, 'create');

    //act
    const userResponse = await dummyService.dummyPrismaService(userRequest);

    // assert
    expect(findMany).toHaveBeenCalledTimes(GeneralTestConstant.ONCE);
    expect(create).toHaveBeenCalledTimes(GeneralTestConstant.ONCE);
    expect(create).toHaveBeenCalledWith({data:userRequest});
    expect(userResponse).toHaveLength(CANTIDAD_REGISTROS);
  });

});
