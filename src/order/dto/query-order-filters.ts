import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export class QueryOrderFilters {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  public user?: number;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsEnum({ asc: "asc", desc: "desc" })
  @IsOptional()
  public order: string = "desc";

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
