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
  @IsOptional()
  @IsNumber()
  id: number;

  // @IsUUID() TODO:  validar el tipo de uid que llega de microsoft
  @IsString()
  @IsOptional()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  identificationType: string;

  @IsString()
  identification;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
