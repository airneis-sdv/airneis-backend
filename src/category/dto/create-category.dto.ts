import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public slug?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public thumbnailId?: number;
}
