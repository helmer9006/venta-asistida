import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateAlliesAdvisorDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Identificador unico del asesor',
    nullable: false,
    example: 23,
  })
  advisorId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Identificador unico del aliado',
    nullable: false,
    example: 25,
  })
  allyId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}
