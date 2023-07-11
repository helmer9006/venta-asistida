import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UserRequest {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  customerName: string;

  @IsPositive({ message: 'La edad debe ser entero positivo.' })
  age: number;
}
