import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
  IsEmail,
  IsPositive,
  isNumber,
} from 'class-validator';

export class CreateLogDto {
  @IsNumber()
  @ApiProperty({
    description: 'Identificador unico del usuario que realiza la acción.',
    nullable: false,
    example: 1,
  })
  actionUserId: number;

  @IsString()
  @ApiProperty({
    description: 'Descripción de la acción realizada.',
    nullable: false,
    example: 'El Rol fue actualizado.',
  })
  description: string;

  @IsString()
  @ApiProperty({
    description: 'Descripción estándar de la acción realizada.',
    nullable: false,
    example: 'ROLE_UPDATE',
  })
  typeAction: string;

  @IsString()
  @ApiProperty({
    description: 'Objeto de datos insertados en formato string.',
    nullable: false,
    example: '{"name":"administrador-","description":"","isActive":true}',
  })
  data: string;

  @IsString()
  @ApiProperty({
    description: 'Nombre del modelo a gestionar.',
    nullable: false,
    example: 'Users',
  })
  model: string;

  @IsNumber()
  @ApiProperty({
    description:
      'Identificador del registro relacionado al modelo que se gestiona.',
    nullable: false,
    example: 1,
  })
  modelId: number;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    description: 'Fecha de registro del log.',
    nullable: true,
    example: '2023-07-24 14:00:13.521',
  })
  createdAt: Date;
}
