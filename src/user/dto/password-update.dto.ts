import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class PasswordUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  public newPassword: string;
}
