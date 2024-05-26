import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

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
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  public price: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  public stock: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public priority: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public categoryId?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  public materialIds?: number[];

  @ApiProperty()
  @ApiPropertyOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  public imageIds?: number[];

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  public backgroundImageId?: number;
}
