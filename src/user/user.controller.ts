import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { CreateOrderDto } from "src/order/dto/create-order.dto";
import { QueryOrderFilters } from "src/order/dto/query-order-filters";
import { OrderService } from "src/order/order.service";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { UserRequest } from "../auth/decorators/user-request.decorator";
import { BasketDto } from "./dto/basket.dto";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { DeleteBasketDto } from "./dto/delete-basket.dto";
import { PasswordUpdateDto } from "./dto/password-update.dto";
import { SelfUpdateUserDto } from "./dto/self-update-user.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly usersService: UsersService,
    private readonly orderService: OrderService) { }

  @Get()
  @Authorize()
  @ApiCookieAuth()
  async find(@UserRequest() user: User) {
    const foundUser = await this.usersService.findOne(user.id);
    return { success: true, user: foundUser };
  }

  @Patch()
  @Authorize()
  @ApiCookieAuth()
  async update(@UserRequest() user: User, @Body() selfUpdateUserDto: SelfUpdateUserDto) {
    const updatedUser = await this.usersService.update(user.id, selfUpdateUserDto);
    return { success: true, user: updatedUser };
  }

  @Patch("password")
  @Authorize()
  @ApiCookieAuth()
  async updatePassword(@UserRequest() user: User, @Body() passwordUpdateDto: PasswordUpdateDto) {
    await this.usersService.updatePassword(user.id, passwordUpdateDto);
    return { success: true };
  }

  @Post("addresses")
  @Authorize()
  @ApiCookieAuth()
  async createAddress(@UserRequest() user: User, @Body() createAddressDto: CreateUserAddressDto) {
    const address = await this.usersService.createAddress(user.id, createAddressDto);
    return { success: true, address };
  }

  @Get("addresses")
  @Authorize()
  @ApiCookieAuth()
  async findAllAddresses(@UserRequest() user: User) {
    const addresses = await this.usersService.findAllAddresses(user.id);
    return { success: true, addresses };
  }

  @Get("addresses/:addressId")
  @Authorize()
  @ApiCookieAuth()
  async findAddress(@UserRequest() user: User, @Param("addressId") addressId: string) {
    const address = await this.usersService.findOneAddress(user.id, +addressId);
    return { success: true, address };
  }

  @Patch("addresses/:addressId")
  @Authorize()
  @ApiCookieAuth()
  async updateAddress(@UserRequest() user: User, @Param("addressId") addressId: string, @Body() updateAddressDto: UpdateUserAddressDto) {
    await this.usersService.updateAddress(user.id, +addressId, updateAddressDto);

    const address = await this.usersService.findOneAddress(user.id, +addressId);
    return { success: true, address };
  }

  @Delete("addresses/:addressId")
  @Authorize()
  @ApiCookieAuth()
  async removeAddress(@UserRequest() user: User, @Param("addressId") addressId: string) {
    await this.usersService.removeAddress(user.id, +addressId);
    return { success: true };
  }

  @Post("basket")
  @Authorize()
  @ApiCookieAuth()
  async createBasketItem(@UserRequest() user: User, @Body() basketDto: BasketDto) {
    await this.usersService.addBasketItem(user.id, basketDto);
    const basket = await this.usersService.getBasketItems(user.id);

    return { success: true, ...basket };
  }

  @Get("basket")
  @Authorize()
  @ApiCookieAuth()
  async findAllBasketItems(@UserRequest() user: User) {
    const basket = await this.usersService.getBasketItems(user.id);
    return { success: true, ...basket };
  }

  @Patch("basket")
  @Authorize()
  @ApiCookieAuth()
  async updateBasketItem(@UserRequest() user: User, @Body() basketDto: BasketDto) {
    await this.usersService.updateBasketItem(user.id, basketDto);
    const basket = await this.usersService.getBasketItems(user.id);

    return { success: true, ...basket };
  }

  @Delete("basket")
  @Authorize()
  @ApiCookieAuth()
  async removeBasketItem(@UserRequest() user: User, @Body() deleteBasketDto: DeleteBasketDto) {
    await this.usersService.removeBasketItem(user.id, deleteBasketDto.productId);
    const basket = await this.usersService.getBasketItems(user.id);

    return { success: true, ...basket };
  }

  @Post("basket/clear")
  @Authorize()
  @ApiCookieAuth()
  async removeAllBasketItems(@UserRequest() user: User) {
    await this.usersService.clearBasket(user.id);
    return { success: true };
  }

  @Get("orders")
  @Authorize()
  @ApiCookieAuth()
  async findAllOrders(@UserRequest() user: User, @Query() query: QueryOrderFilters) {
    query.user = user.id;

    const results = await this.orderService.findAll(query);
    return { success: true, ...results };
  }

  @Post("orders")
  @Authorize()
  @ApiCookieAuth()
  public create(@UserRequest() user: User, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createUserOrder(user.id, createOrderDto);
  }

  @Get("orders/:id")
  @Authorize()
  @ApiCookieAuth()
  async findOneOrder(@UserRequest() user: User, @Param("id") id: string) {
    const order = await this.orderService.findOne(+id, user.id);
    return { success: true, order };
  }

  @Post("orders/:id/cancel")
  @Authorize()
  @ApiCookieAuth()
  async cancelOrder(@UserRequest() user: User, @Param("id") id: string) {
    const order = await this.orderService.cancelOrder(+id, user.id);
    return { success: true, order };
  }
}
