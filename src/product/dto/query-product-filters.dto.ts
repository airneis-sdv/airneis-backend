import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class QueryProductFiltersDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  public search?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public categories?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public materials?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  public minPrice?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  public maxPrice?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  public stock?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  public featured?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsEnum({ id: "id", name: "name", priority: "priority", price: "price", category: "category", stock: "stock", createdAt: "createdAt" })
  @IsOptional()
  public sort?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsEnum({ asc: "asc", desc: "desc" })
  @IsOptional()
  public order?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  public page?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  public limit: number = 10;
}
