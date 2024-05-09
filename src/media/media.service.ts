import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import * as path from "path";
import { FindOptionsWhere, In, Like, Repository } from "typeorm";
import { QueryMediaFiltersDto } from "./dto/query-media-filters.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { Media } from "./entities/media.entity";
import { MediaFileType } from "./enums/media-file-type.enum";

@Injectable()
export class MediaService {
  static UPLOAD_DIR: string;

  constructor(private readonly configService: ConfigService,
    @InjectRepository(Media) private mediaRepository: Repository<Media>) {
    MediaService.UPLOAD_DIR = this.configService.getOrThrow<string>("MEDIA_UPLOAD_DIR");
  }

  create(file: Express.Multer.File) {
    const media = this.mediaRepository.create({ name: file.originalname, filename: file.filename, type: file.mimetype, size: file.size });
    return this.mediaRepository.save(media);
  }

  async serve(hash: string) {
    const media = await this.mediaRepository.findOne({ where: { filename: hash } });
    if (!media) throw new NotFoundException(`Media with hash ${hash} not found`);

    const file = fs.createReadStream(path.join(MediaService.UPLOAD_DIR, media.filename));
    return new StreamableFile(file, { type: media.type, disposition: "inline" });
  }

  async findAll(filters: QueryMediaFiltersDto) {
    const where: FindOptionsWhere<Media> = {};
    if (filters.search) where.name = Like(`%${filters.search}%`);
    if (filters.type) {
      switch (filters.type) {
        case MediaFileType.IMAGE:
          where.type = In(["image/png", "image/jpg", "image/jpeg"]);
          break;
      }
    }

    const mediaCount = await this.mediaRepository.count({ where });
    const totalPages = Math.ceil(mediaCount / filters.limit);

    if (filters.limit < 1 || filters.limit > 20)
      throw new BadRequestException("Limit must be between 1 and 20");

    if (filters.page && (filters.page < 1 || filters.page > totalPages))
      throw new BadRequestException("Page is out of bounds, max page is " + totalPages);

    const result = await this.mediaRepository.find({ where, take: filters.limit, skip: filters.page ? filters.limit * (filters.page - 1) : 0 });
    return { medias: result, limit: filters.limit, page: filters.page ?? 1, mediaCount, totalPages };
  }

  async findOne(id: number) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException(`Media with id ${id} not found`);

    return media;
  }

  async updateFile(id: number, file: Express.Multer.File) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException(`Media with id ${id} not found`);

    if (file) {
      fs.rmSync(path.join(MediaService.UPLOAD_DIR, media.filename), { force: true });
      media.name = file.originalname;
      media.filename = file.filename;
      media.type = file.mimetype;
      media.size = file.size;
    }

    const result = await this.mediaRepository.update(id, media);

    if (result.affected !== 1)
      throw new InternalServerErrorException(`Failed to update media with id ${id}`);
  }

  async updateProperties(id: number, updateMediaDto: UpdateMediaDto) {
    const result = await this.mediaRepository.update(id, updateMediaDto);

    if (result.affected !== 1)
      throw new NotFoundException(`Media with id ${id} not found`);
  }

  async remove(id: number) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException(`Media with id ${id} not found`);

    fs.rmSync(path.join(MediaService.UPLOAD_DIR, media.filename), { force: true });

    const result = await this.mediaRepository.delete(id);

    if (result.affected !== 1)
      throw new InternalServerErrorException(`Failed to delete media with id ${id}`);
  }
}
