import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { MediaService } from 'src/media/media.service';
import { Repository } from "typeorm";
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);

    if (createCategoryDto.thumbnailId !== undefined) {
      const thumbnail = createCategoryDto.thumbnailId === null ? null : await this.mediaService.findOne(createCategoryDto.thumbnailId);

      delete createCategoryDto.thumbnailId;
      category.thumbnail = thumbnail;
    }

    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find({ relations: { thumbnail: true } });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: { thumbnail: true } });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: { thumbnail: true } });

    if (updateCategoryDto.thumbnailId !== undefined) {
      const thumbnail = updateCategoryDto.thumbnailId === null ? null : await this.mediaService.findOne(updateCategoryDto.thumbnailId);

      delete updateCategoryDto.thumbnailId;
      category.thumbnail = thumbnail;
    }

    const result = await this.categoryRepository.update(id, { ...updateCategoryDto, thumbnail: category.thumbnail });

    if (result.affected !== 1)
      throw new NotFoundException(`Category with id ${id} not found`);
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);

    if (result.affected !== 1)
      throw new NotFoundException(`Category with id ${id} not found`);
  }
}
