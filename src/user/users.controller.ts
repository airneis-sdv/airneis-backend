import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { Role } from "src/auth/enums/role.enum";
import { CreateUserDto } from "./dto/create-user.dto";
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
}
