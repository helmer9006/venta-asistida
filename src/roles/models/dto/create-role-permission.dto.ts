import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRolePermissionDto {
  @IsNumber()
  roleId: number;

  @IsNumber()
  permissionId: number;

  @IsOptional()
  @IsDate({ message: 'La fecha de actualización debe ser de tipo fecha' })
  updatedAt: Date;
}
