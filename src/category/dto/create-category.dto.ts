import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @IsOptional()
  public slug?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public thumbnailId?: number;
}
