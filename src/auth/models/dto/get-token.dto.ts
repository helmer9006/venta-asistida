import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetTokenDto {
    @ApiProperty({
        description: 'Code B2C',
        nullable: false,
        minLength: 1,
        example: {
            code: 'as2df1a21sdf21as2df1a5sdf41'
        }
    })
    @IsString()
    code: string;
}