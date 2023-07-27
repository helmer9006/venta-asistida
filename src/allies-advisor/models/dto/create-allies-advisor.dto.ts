import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateAlliesAdvisorDto {
  @IsNumber()
  @IsPositive()
  advisorId: number;

  @IsNumber()
  @IsPositive()
  allyId: number;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
