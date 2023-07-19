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

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Identificador unico del usuario en B2C',
    nullable: true,
    example: "2f16c33b-73dc-4df1-9219-558540bcdf19"
  })
  uid: string;
  @IsString()
  @ApiProperty({
    description: 'Nombre del usuurio',
    nullable: true,
    example: "Juan"
  })
  name: string;
  @IsString()
  @ApiProperty({
    description: 'Apellido del usuario',
    nullable: false,
    example: "Perez ramirez"
  })
  lastname: string;

  @IsString()
  @ApiProperty({
    description: 'Tipo de identificación del usuario',
    nullable: false,
    example: "CC"
  })
  identificationType: string;

  @IsString()
  @ApiProperty({
    description: 'Identificación del usuario',
    nullable: false,
    example: "1051215141"
  })
  identification;

  @IsString()
  @ApiProperty({
    description: 'Dirección residencia del usuario',
    nullable: false,
    example: "Cra 30 # 20-51"
  })
  address: string;

  @IsString()
  @ApiProperty({
    description: 'Telefono o celular del usuario',
    nullable: false,
    example: "32031515542"
  })
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Correo del usuario',
    nullable: false,
    example: "juan123@gmail.com"
  })
  email: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Estado del usuario',
    nullable: false,
    example: true
  })
  isActive: boolean;

  @IsNumber()
  @ApiProperty({
    description: 'Id del rol asignado al usuario.',
    nullable: false,
    example: 1
  })
  roleId: number;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
