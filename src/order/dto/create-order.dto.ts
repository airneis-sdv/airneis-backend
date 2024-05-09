import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  public billingAddressId: number;

  @ApiProperty()
  @IsInt()
  public shippingAddressId: number;
}
