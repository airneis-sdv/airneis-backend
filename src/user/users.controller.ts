import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiQuery } from "@nestjs/swagger";

// Prevents fields with @Exclude() from being returned in the response
@UseInterceptors(ClassSerializerInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { success: true, user };
  }

  @Get()
  @ApiQuery({ name: "search", required: false })
  async findAll(@Query() query: { search?: string }) {
    const users = query.search
      ? await this.usersService.findAllBySearch(query.search)
      : await this.usersService.findAll();

    return { success: true, users };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return { success: true, user };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${id} not found`);

    const user = await this.usersService.findOne(+id);
    return { success: true, user };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const result = await this.usersService.remove(+id);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${id} not found`);

    return { success: true };
  }
}
