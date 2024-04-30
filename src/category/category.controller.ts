import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { Role } from "../auth/enums/role.enum";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return { success: true, category };
  }

  @Get()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return { success: true, categories };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const category = await this.categoryService.findOne(+id);
    return { success: true, category };
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    const category = await this.categoryService.findbySlug(slug);
    return { success: true, category };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    console.log(updateCategoryDto);
    await this.categoryService.update(+id, updateCategoryDto);

    const category = await this.categoryService.findOne(+id);
    return { success: true, category };
  }

  @Delete(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async remove(@Param("id") id: string) {
    await this.categoryService.remove(+id);
    return { success: true };
  }
}
