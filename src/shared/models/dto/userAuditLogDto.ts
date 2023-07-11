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

export class NewAuditLogDto {
  @IsNumber()
  id?: number;

  @IsNumber()
  userId: number;

  @IsString()
  description: string;

  @IsString()
  typeAction: string;

  @IsString()
  data: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;
}
