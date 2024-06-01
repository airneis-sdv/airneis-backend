import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class QueryUserFiltersDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  public search?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  public limit: number = 10;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  public page?: number;
}
