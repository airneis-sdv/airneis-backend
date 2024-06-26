import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { Role } from "../auth/enums/role.enum";
import { MaterialDto } from "./dto/material.dto";
import { MaterialService } from "./material.service";

@ApiTags("materials")
@Controller("materials")
export class MaterialController {
  constructor(private readonly materialService: MaterialService) { }

  @Post()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async create(@Body() createMaterialDto: MaterialDto) {
    const material = await this.materialService.create(createMaterialDto);
    return { success: true, material };
  }

  @Get()
  async findAll() {
    const materials = await this.materialService.findAll();
    return { success: true, materials };
  }

  @Get(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findOne(@Param("id") id: string) {
    const material = await this.materialService.findOne(+id);
    return { success: true, material };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async update(@Param("id") id: string, @Body() materialDto: MaterialDto) {
    await this.materialService.update(+id, materialDto);

    const material = await this.materialService.findOne(+id);
    return { success: true, material };
  }

  @Delete(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async remove(@Param("id") id: string) {
    await this.materialService.remove(+id);
    return { success: true };
  }
}
