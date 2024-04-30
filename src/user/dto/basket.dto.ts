import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class BasketDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  public productId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  public quantity: number;
}
