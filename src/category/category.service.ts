import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Utils } from "../common/utils";
import { MediaService } from "../media/media.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.createOrUpdateCategory(category, createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find({ relations: { thumbnail: true } });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: { thumbnail: true } });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async findbySlug(slug: string) {
    const category = await this.categoryRepository.findOne({ where: { slug }, relations: { thumbnail: true } });
    if (!category) throw new NotFoundException(`Category with slug ${slug} not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: { thumbnail: true } });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    return this.createOrUpdateCategory(category, updateCategoryDto);
  }

  async createOrUpdateCategory(category: Category, dto: CreateCategoryDto | UpdateCategoryDto) {
    if (dto.slug === undefined && dto instanceof CreateCategoryDto) {
      dto.slug = Utils.generateRandomString(4) + "-" + dto.name.toLowerCase();
    }

    if (dto.slug !== undefined) {
      dto.slug = Utils.slugify(dto.slug);

      const categoryBySlug = await this.categoryRepository.findOne({ where: { slug: dto.slug } });
      if (categoryBySlug && categoryBySlug.id !== category?.id)
        throw new BadRequestException("Slug with the name \"" + dto.slug + "\" already exists");
    }

    if (dto.thumbnailId !== undefined)
      category.thumbnail = dto.thumbnailId === null ? null : await this.mediaService.findOne(dto.thumbnailId);

    return this.categoryRepository.save(this.categoryRepository.merge(category, dto));
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected !== 1)
      throw new NotFoundException(`Category with id ${id} not found`);
  }
}
