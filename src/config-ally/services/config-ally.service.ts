import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import { HttpStatus, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { GenericResponse } from '@src/shared/models/generic-response.model';
import { IAttributes } from '../interfaces/format-attributes.interface';
import config from '@src/config/config';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Injectable()
export class ConfigAllyService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(config.KEY)
    private readonly configuracion: ConfigType<typeof config>,
  ) {}

  async create(createConfigAllyDto: CreateConfigAllyDto) {
    let allyFound;
    try {
      allyFound = await this.prismaService.configAlly.findUnique({
        where: { id: createConfigAllyDto.allyId },
      });
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error interno del servidor.',
      );
    }

    if (!allyFound) {
      throw new GenericResponse(
        null,
        HttpStatus.NOT_FOUND,
        'No se pudo encontrar el aliado.',
      );
    }
    const fileNameform = `Formulario ${allyFound.name}`;
    const attributes: IAttributes[] = JSON.parse(
      createConfigAllyDto.attributes,
    );
    const allAttributesRequired =
      this.configuracion.ATTRIBUTES_REQUIRED_FORM_BASE.every(
        (attributeRequire) =>
          attributes
            .map((attribute) => attribute.name)
            .includes(attributeRequire),
      );
    if (!allAttributesRequired)
      throw new GenericResponse(
        {},
        HttpStatus.BAD_REQUEST,
        'Se requieren todos los atributos del formulario base.',
      );
    createConfigAllyDto.name = fileNameform;
    createConfigAllyDto.formBase = false;
    const body: any = createConfigAllyDto;
    try {
      return await this.prismaService.configAlly.create({ data: body });
    } catch (error) {
      throw new GenericResponse(
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error interno del servidor.',
      );
    }
  }

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

      const configAlly = await this.prismaService.configAlly.findMany({
        where: {
          allyId: idAlly,
        },
        include: {
          ally: true,
        },
      });
      if (configAlly.length == 0)
        throw new GenericResponse(
          {},
          HttpStatus.NOT_FOUND.valueOf(),
          'No se pudo obtener la configuracion del aliado',
        );

      configAlly[0].attributes = JSON.parse(configAlly[0].attributes);
      return configAlly[0];
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
