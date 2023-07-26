import { UsePipes } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class RequestGetLogsDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Identificador unico del registro a consultar.',
    nullable: false,
    example: 1,
  })
  modelId: number;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Nombre del modelo a gestionar(ejemplo: Users o Roles).',
    nullable: false,
    example: 'Users',
  })
  model: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Fecha inicial para rango de búsqueda.',
    nullable: false,
    example: '2023-07-01 00:03:000',
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Fecha final para rango de búsqueda.',
    nullable: false,
    example: '2023-07-30 23:59:000',
  })
  endDate: Date;
}
