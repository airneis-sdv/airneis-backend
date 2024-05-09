import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "src/auth/enums/role.enum";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { QueryOrderFilters } from "./dto/query-order-filters";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderService } from "./order.service";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("orders")
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findAll(@Query() query: QueryOrderFilters) {
    const result = await this.orderService.findAll(query);
    return { success: true, ...result };
  }

  @Get(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findOne(@Param("id") id: number) {
    const order = await this.orderService.findOne(id);
    return { success: true, order };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async update(@Param("id") id: number, @Body() updateOrderDto: UpdateOrderDto) {
    const order = await this.orderService.update(id, updateOrderDto);
    return { success: true, order };
  }
}
