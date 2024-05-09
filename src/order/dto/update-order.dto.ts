import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class UpdateOrderDto {
  @ApiProperty()
  @IsEnum(OrderStatus)
  public status: OrderStatus;
}
