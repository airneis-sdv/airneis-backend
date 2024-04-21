import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AuthRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public cookies?: boolean;
}
