import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetTokenDto {
    @ApiProperty({
        description: 'Code B2C',
        nullable: false,
        minLength: 1,
        example: "eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMCIsInppcCI6IkRlZmxhdGUiLCJzZXIiOiIxLjAifQ..tyJHvQJQ62TDlvc-.a4RcDa0uSwxf26vFPvx1sjq-yZf6efaszmyLM36aoQWOkrttUyZgabQoWmanzwysUz4T1A-Jvxm8I3BWGOjBXANubrRYRDMKG70YtvlwWWDFyV3QhAP_nY9auRnphAECXFNqToKDe0gwRnJjQg6b2Y_HqKkEIiST7iU-F7OmnDcAh9chXcilVveQwxICAbqtOJNgV0xD-ocHZABZcvxcKq7wv3J_Rd05f66-tEDSBDr4e7ZsPYjR7BS-3TrwHd6bkoai_DBXmgJHvWKLHhiwinbNbi44C3oj8vKZEnAdlbcLWwKaZpy4i2D43-e_XfJmB8C6mCOKFVzrh8SLOttSRQsKyOx1yiWGxyGHiid6i-aLv2DJ4AGZCj67aHxA0QhoTOLs_fdJjBWyk_mSnVaxYhxQEVvIqGtAh8DwOLYvWPDSbr56CsOM6skHscnXAdFRXaQajhSuGngRNYTVGPXWhGmYQZ8hBGZBr7lep_d5zCor073vcynpk2Ml6ziWhymwmouIBAqESdQc1t8Bkzv8XBkZ98d5Z_aSDb8f5x2w8CzDAPZXp0A0nnlEYW6UwLOO2zwVHQ.AF5N9lR-t7e-xlTGWaUSbA"
    })
    // @IsString()
    code: string;
}