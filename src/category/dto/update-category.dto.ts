import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

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
  @IsNumber()
  @IsOptional()
  public thumbnailId?: number;
}
