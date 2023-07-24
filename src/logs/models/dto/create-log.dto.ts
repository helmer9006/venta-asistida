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

export class CreateLogDto {
    @IsNumber()
    actionUserId: number;

    @IsString()
    description: string;

    @IsString()
    typeAction: string;

    @IsString()
    data: string;

    @IsString()
    model: string;

    @IsNumber()
    modelId: number

    @IsOptional()
    @IsDate()
    createdAt: Date;
}
