import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { MediaFileType } from "../enums/media-file-type.enum";

export class QueryMediaFiltersDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiProperty({ enum: MediaFileType })
  @ApiPropertyOptional()
  @IsEnum(MediaFileType)
  @IsOptional()
  public type?: MediaFileType;

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
