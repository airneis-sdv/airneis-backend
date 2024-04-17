import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { Role } from "src/auth/enums/role.enum";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductFiltersDto } from "./dto/query-product-filters.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags("products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return { success: true, product };
  }

  @Get()
  async findAll(@Query() filters: QueryProductFiltersDto) {
    const results = await this.productService.findAll(filters);
    return { success: true, ...results };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const product = await this.productService.findOne(+id);
    return { success: true, product };
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    const product = await this.productService.findBySlug(slug);
    return { success: true, product };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productService.update(+id, updateProductDto);
    return { success: true, product };
  }

  @Delete(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async remove(@Param("id") id: string) {
    await this.productService.remove(+id);
    return { success: true };
  }
}
