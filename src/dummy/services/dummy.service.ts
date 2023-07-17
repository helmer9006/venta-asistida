import { HttpStatus, Injectable } from '@nestjs/common';
import { ExampleProviderService } from '@src/adapter/example-provider/services/example-provider.service';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { Users } from '@prisma/client';
import { UserRequest } from '../models/request/user-request.model';
import { ConflictException } from '@src/shared/exceptions/conflict.exception';

@Injectable()
export class DummyService {
  constructor(
    private readonly exampleProviderService: ExampleProviderService,

    private readonly prismaService: PrismaService,
  ) {}

  async dummyServiceExample() {
    const data = await this.exampleProviderService.getDataFromProvider();
    return data;

    return 'Not enable feature try again later...';
  }

  // async dummyPrismaService(userDto: UserRequest): Promise<User[]> {
  //   const { name, lastname } = userDto;
  //   try {
  //     await this.prismaService.users.create({ data: { name, lastname } });
  //     return this.prismaService.users.findMany();
  //   } catch (error) {
  //     throw new ConflictException({
  //       status: HttpStatus.CONFLICT.valueOf(),
  //       details: 'Hay conflictos para crear el usuario',
  //       error: 'Error creando usuario',
  //       title: 'Error creando usuario'
  //     })
  //   }
  // }
}
