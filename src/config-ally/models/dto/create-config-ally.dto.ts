import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsDate,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateConfigAllyDto {
  @IsNumber(
    {},
    { message: 'El atributo id de aliado es requerido y debe ser un número.' },
  )
  @IsPositive({
    message:
      'El atributo id de aliado es requerido y debe ser un número entero positivo.',
  })
  @ApiProperty({
    description: 'Identificador del aliado relacionado a la configuración.',
    nullable: false,
    example: 1,
  })
  allyId?: number;

  @IsOptional()
  @IsBoolean()
  // @ApiProperty({
  //   description:
  //     'Campo que define si el registro corresponde a la configuración del formulario base.',
  //   nullable: true,
  //   example: 1,
  // })
  formBase?: boolean;

  @IsOptional()
  @IsString()
  // @ApiProperty({
  //   description: 'Nombre definido para el registro de configuración.',
  //   nullable: false,
  //   example: 'Formulario exito',
  // })
  name?: string;

  @IsString({
    message:
      'El campo atributos de la configuración es requerido y debe contener todas las propiedades del formulario base.',
  })
  @ApiProperty({
    description:
      'Campos definidos para el formulario, se almacena en un array de objetos con cada propiedad.',
    nullable: false,
    example: [
      { name: 'firtsName', required: true, disabled: false, type: 'text' },
      { name: 'secondName', required: false, disabled: false, type: 'text' },
      { name: 'surname', required: true, disabled: false, type: 'text' },
      { name: 'secondSurname', required: false, disabled: false, type: 'text' },
      { name: 'birthdate', required: true, disabled: false, type: 'date' },
      { name: 'department', required: true, disabled: false, type: 'select' },
      { name: 'municipality', required: true, disabled: false, type: 'select' },
      {
        name: 'identificationType',
        required: true,
        disabled: false,
        type: 'text',
      },
      {
        name: 'identification',
        required: true,
        disabled: false,
        type: 'number',
      },
      { name: 'expeditionDate', required: true, disabled: false, type: 'date' },
      {
        name: 'expeditionPlace',
        required: true,
        disabled: false,
        type: 'text',
      },
      { name: 'gender', required: true, disabled: false, type: 'text' },
      { name: 'address', required: true, disabled: false, type: 'text' },
      { name: 'phoneNumber', required: true, disabled: false, type: 'number' },
      { name: 'email', required: true, disabled: false, type: 'text' },
    ],
  })
  attributes: string;

  @IsString({ message: 'El atributo politas de datos es requerido.' })
  @ApiProperty({
    description:
      'Campo definido para insertar texto de políticas de tratamiento de datos.',
    nullable: false,
    example:
      'En cumplimiento de las disposiciones de la Ley 1581 de 2012 y del Decreto reglamentario 1377 de 2013 que desarrollan el derecho de habeas data...',
  })
  dataPolicy: string;

  @IsString({
    message: 'El atributo politicas de datos no esenciales es obligatorio.',
  })
  @ApiProperty({
    description:
      'Campos definidos para el tratamiento de datos no esenciales de cada aliado, se almacena en array de objetos con propiedades.',
    nullable: false,
    example: [
      { name: 'Recibir notificaciones sms', disabled: true, type: 'text' },
      {
        name: 'Recibir notificaciones whatsApp',
        disabled: false,
        type: 'text',
      },
    ],
  })
  noEssentialDataPolicy: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
