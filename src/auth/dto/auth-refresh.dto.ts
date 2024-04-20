import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class AuthRefreshDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public refresh_token: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public cookies?: boolean;
}
