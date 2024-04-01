import { Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { MultipleFileTypeValidator } from "src/common/validators/multiple-file-type.validator";
import { Authorize } from "../auth/decorators/authorize.decorator";
import { Role } from "../auth/enums/role.enum";
import { QueryMediaFiltersDto } from "./dto/query-media-filters.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { Media } from "./entities/media.entity";
import { MediaService } from "./media.service";

@ApiTags("medias")
@Controller("medias")
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Get("serve/:hash")
  async serve(@Param("hash") hash: string) {
    return this.mediaService.serve(hash);
  }

  @Post()
  @Authorize(Role.ADMIN)
  @UseInterceptors(FileInterceptor("file"))
  @ApiCookieAuth()
  async create(@UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new MaxFileSizeValidator({ maxSize: Media.MAX_SIZE }),
        new MultipleFileTypeValidator({ fileType: Media.ALLOWED_TYPES }),
      ],
    })
  ) file: Express.Multer.File) {
    console.log(file)
    const media = await this.mediaService.create(file);
    return { success: true, media };
  }

  @Get()
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findAll(@Query() filters: QueryMediaFiltersDto) {
    const results = await this.mediaService.findAll(filters);
    return { success: true, ...results };
  }

  @Get(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async findOne(@Param("id") id: string) {
    const media = await this.mediaService.findOne(+id);
    return { success: true, media };
  }

  @Patch(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async updateProperties(@Param("id") id: string, @Body() updateMediaDto: UpdateMediaDto) {
    await this.mediaService.updateProperties(+id, updateMediaDto);

    const media = await this.mediaService.findOne(+id);
    return { success: true, media };
  }

  @Put(":id/file")
  @Authorize(Role.ADMIN)
  @UseInterceptors(FileInterceptor("file"))
  @ApiCookieAuth()
  async updateFile(@UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new MaxFileSizeValidator({ maxSize: Media.MAX_SIZE }),
        new MultipleFileTypeValidator({ fileType: Media.ALLOWED_TYPES }),
      ],
    })
  ) file: Express.Multer.File, @Param("id") id: string) {
    await this.mediaService.updateFile(+id, file);

    const media = await this.mediaService.findOne(+id);
    return { success: true, media };
  }

  @Delete(":id")
  @Authorize(Role.ADMIN)
  @ApiCookieAuth()
  async remove(@Param("id") id: string) {
    await this.mediaService.remove(+id);
    return { success: true };
  }
};
