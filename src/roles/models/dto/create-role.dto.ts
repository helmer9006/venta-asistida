import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'El nombre debe ser de tipo texto y es obligatorio' })
  @ApiProperty({
    description: 'Nombre del rol',
    nullable: false,
    example: 'Administrador',
  })
  name: string;

  @IsString({ message: 'La descripción debe ser de tipo texto.' })
  @IsOptional()
  @ApiProperty({
    description: 'Descripcion corta del rol',
    nullable: false,
    example: 'Administrador del sistema.',
  })
  description: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Estado del rol en el sistema',
    nullable: false,
    example: true,
  })
  isActive: boolean;

  @IsOptional()
  @IsDate({ message: 'La fecha de creación debe ser de tipo fecha' })
  createdAt: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha de actualización debe ser de tipo fecha' })
  updatedAt: Date;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'lista de identificadores de permisos asignados al rol',
    nullable: true,
    example: [1, 2],
  })
  permissions: number[];
}
