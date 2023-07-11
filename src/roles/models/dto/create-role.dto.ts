import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString({ message: 'El nombre debe ser de tipo texto y es obligatorio' })
    name: string;

    @IsString({ message: 'La descripción debe ser de tipo texto.' })
    @IsOptional()
    description: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsDate({ message: 'La fecha de creación debe ser de tipo fecha' })
    createdAt: Date

    @IsOptional()
    @IsDate({ message: 'La fecha de actualización debe ser de tipo fecha' })
    updatedAt: Date;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    permissions: number[]

}