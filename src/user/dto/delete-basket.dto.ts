import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteBasketDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  public productId: number;
}
