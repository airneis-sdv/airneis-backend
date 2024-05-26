import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateProductDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public slug?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  public price?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public stock?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public priority?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public categoryId?: number;

  @ApiProperty()
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  @IsOptional()
  public materialIds?: number[];

  @ApiProperty()
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  @IsOptional()
  public imageIds?: number[];

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public backgroundImageId?: number;
}
