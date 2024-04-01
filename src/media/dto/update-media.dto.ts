import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateMediaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}
