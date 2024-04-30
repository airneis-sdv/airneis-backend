import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { UserRequest } from "../auth/decorators/user-request.decorator";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { PasswordUpdateDto } from "./dto/password-update.dto";
import { SelfUpdateUserDto } from "./dto/self-update-user.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly usersService: UsersService) { }

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
    await this.usersService.update(user.id, selfUpdateUserDto);

    const updatedUser = await this.usersService.findOne(user.id);
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
}
