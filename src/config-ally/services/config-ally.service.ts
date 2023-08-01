import { CreateConfigAllyDto } from '../models/dto/create-config-ally.dto';
import { UpdateConfigAllyDto } from '../models/dto/update-config-ally.dto';
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { IAttributes } from '../interfaces/format-attributes.interface';
import config from '@src/config/config';
import { ConfigType } from '@nestjs/config';
import { handleExceptions } from '@src/shared/helpers/general';

@Injectable()
export class ConfigAllyService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(config.KEY)
    private readonly configuracion: ConfigType<typeof config>,
  ) {}

  async create(createConfigAllyDto: CreateConfigAllyDto) {
    try {
      const allyFound = await this.findAllyById(createConfigAllyDto.allyId);
      const fileNameform = `Formulario ${allyFound.name}`;
      await this.verifyRequiredAttributes(createConfigAllyDto.attributes);
      createConfigAllyDto.name = fileNameform;
      createConfigAllyDto.formBase = false;
      const body: any = createConfigAllyDto;

      const config = await this.prismaService.configAlly.create({ data: body });
      return config;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findOne(idFormBase: number, idAlly: number) {
    try {
      if (idFormBase && idAlly)
        throw new NotFoundException('La url proporcionada no es valida.');

      if (Number.isNaN(idAlly)) {
        const formBase = await this.prismaService.configAlly.findMany({
          where: { id: idFormBase },
        });
        console.log("object", formBase);
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
        throw new BadRequestException(
          'No se pudo obtener la configuracion del aliado',
        );

      configAlly[0].attributes = JSON.parse(configAlly[0].attributes);
      return configAlly[0];
    } catch (error) {
      handleExceptions(error);
    }
  }

  async update(id: number, updateConfigAllyDto: UpdateConfigAllyDto) {
    try {
      delete updateConfigAllyDto.name;
      await this.findAllyById(updateConfigAllyDto.allyId);
      await this.verifyRequiredAttributes(updateConfigAllyDto.attributes);
      updateConfigAllyDto.formBase = false;
      const configAllyUpdated = await this.prismaService.configAlly.update({
        where: { id },
        data: updateConfigAllyDto,
      });
      return configAllyUpdated;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async findAllyById(allyId: number) {
    try {
      const allyFound = await this.prismaService.users.findMany({
        where: { id: allyId, roleId: Number(process.env.ID_ROLE_ALLY) },
      });
      if (allyFound.length == 0) {
        throw new NotFoundException('No se pudo encontrar el aliado');
      }
      return allyFound[0];
    } catch (error) {
      handleExceptions(error);
    }
  }

  async verifyRequiredAttributes(attributesParam): Promise<void> {
    const attributes: IAttributes[] = attributesParam
      ? JSON.parse(attributesParam)
      : [];
    const hasAllAttributesRequired =
      this.configuracion.ATTRIBUTES_REQUIRED_FORM_BASE.every(
        (attributeRequire) =>
          attributes
            .map((attribute) => attribute.name)
            .includes(attributeRequire),
      );
    if (!hasAllAttributesRequired && attributes.length > 0)
      throw new BadRequestException(
        'Se requieren todos los atributos del formulario base.',
      );
  }
}
