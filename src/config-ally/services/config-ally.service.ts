import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';

@Injectable()
export class ConfigAllyService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createConfigAllyDto: CreateConfigAllyDto) {
    return 'This action adds a new configAlly';
  }

  // findAll() {
  //   return `This action returns all configAlly`;
  // }

  async findOne(idFormBase: number, idAlly: number) {
    if (idFormBase && idAlly)
      throw new GenericResponse(
        [],
        HttpStatus.NOT_FOUND.valueOf(),
        'Url invalida, por favor revisela.',
      );
    try {
      if (Number.isNaN(idAlly)) {
        const formBase = await this.prismaService.configAlly.findMany({
          where: { id: idFormBase },
        });

        const configFormBase = JSON.parse(formBase[0].attributes);
        return configFormBase;
      }

      let configAlly = await this.prismaService.configAlly.findMany({
        where: {
          allyId: idAlly,
        },
        include: {
          ally: true,
        },
      });

      if (!configAlly)
        throw new GenericResponse(
          {},
          HttpStatus.NOT_FOUND.valueOf(),
          'No se pudo obtener la configuracion del aliado',
        );

      configAlly[0].attributes = JSON.parse(configAlly[0].attributes);
      return configAlly;
    } catch (error) {
      throw new GenericResponse(
        [],
        HttpStatus.INTERNAL_SERVER_ERROR.valueOf(),
        'Error de servidor al consultar la configuracion del aliado',
      );
    }
  }

  update(id: number, updateConfigAllyDto: UpdateConfigAllyDto) {
    return `This action updates a #${id} configAlly`;
  }
}
