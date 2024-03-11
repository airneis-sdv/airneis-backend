import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { Role } from "../auth/enums/role.enum";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

// Prevents fields with @Exclude() from being returned in the response
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { success: true, user };
  }

  @Get()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  @ApiQuery({ name: "search", required: false })
  async findAll(@Query() query: { search?: string }) {
    const users = query.search
      ? await this.usersService.findAllBySearch(query.search)
      : await this.usersService.findAll();

    return { success: true, users };
  }

  @Get(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id);
    return { success: true, user };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(+id, updateUserDto);

    const user = await this.usersService.findOne(+id);
    return { success: true, user };
  }

  @Delete(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async remove(@Param("id") id: string) {
    await this.usersService.remove(+id);
    return { success: true };
  }

  @Post(":userId/addresses")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async createAddress(@Param("userId") userId: string, @Body() createAddressDto: CreateUserAddressDto) {
    const address = await this.usersService.createAddress(+userId, createAddressDto);
    return { success: true, address };
  }

  @Get(":userId/addresses")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findAllAddresses(@Param("userId") userId: string) {
    const addresses = await this.usersService.findAllAddresses(+userId);
    return { success: true, addresses };
  }

  @Get(":userId/addresses/:addressId")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findOneAddress(@Param("userId") userId: string, @Param("addressId") addressId: string) {
    const address = await this.usersService.findOneAddress(+userId, +addressId);
    return { success: true, address };
  }

  @Patch(":userId/addresses/:addressId")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async updateAddress(@Param("userId") userId: string, @Param("addressId") addressId: string, @Body() updateAddressDto: UpdateUserAddressDto) {
    await this.usersService.updateAddress(+userId, +addressId, updateAddressDto);

    const address = await this.usersService.findOneAddress(+userId, +addressId);
    return { success: true, address };
  }

  @Delete(":userId/addresses/:addressId")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async removeAddress(@Param("userId") userId: string, @Param("addressId") addressId: string) {
    await this.usersService.removeAddress(+userId, +addressId);
    return { success: true };
  }
}
