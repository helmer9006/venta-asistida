import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Cuantas filas.',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Cuántas filas quieres saltar',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'La página debe ser un número positivo mayor a 0.' })
  offset?: number;
}
