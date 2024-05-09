import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Utils } from "src/common/utils";
import { Between, Equal, FindOptionsOrder, FindOptionsWhere, In, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { MaterialService } from "../material/material.service";
import { MediaService } from "../media/media.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductFiltersDto } from "./dto/query-product-filters.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly materialService: MaterialService,
    private readonly mediaService: MediaService) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.createOrUpdateProduct(product, createProductDto);
  }

  async findAll(filters: QueryProductFiltersDto) {
    const where: FindOptionsWhere<Product> = {};
    const order: FindOptionsOrder<Product> = {};

    if (filters.search)
      where.name = Like(`%${filters.search}%`);

    if (filters.categories)
      where.category = In(filters.categories.split(",").map(Number));

    if (filters.materials)
      where.materials = In(filters.materials.split(",").map(Number));

    if (filters.minPrice && filters.maxPrice) {
      if (filters.minPrice > filters.maxPrice)
        throw new BadRequestException("Min price must be lower than max price");

      where.price = Between(filters.minPrice, filters.maxPrice);
    } else {
      if (filters.minPrice)
        where.price = MoreThanOrEqual(filters.minPrice);

      if (filters.maxPrice)
        where.price = LessThanOrEqual(filters.maxPrice);
    }

    if (filters.stock !== undefined)
      where.stock = filters.stock === 1 ? MoreThanOrEqual(1) : Equal(0);

    if (filters.sort && filters.order)
      order[filters.sort] = { direction: filters.order };

    const productCount = await this.productRepository.count({ where });
    const totalPages = Math.ceil(productCount / filters.limit);

    if (filters.limit < 1 || filters.limit > 20)
      throw new BadRequestException("Limit must be between 1 and 20");

    if (filters.page && (filters.page < 1 || filters.page > totalPages))
      throw new BadRequestException("Page is out of bounds, max page is " + totalPages);

    const result = await this.productRepository.find({
      where,
      take: filters.limit,
      skip: filters.page ? filters.limit * (filters.page - 1) : 0,
      order,
      relations: { category: true, materials: true, images: true, backgroundImage: true },
    });

    return { products: result, limit: filters.limit, page: filters.page ?? 1, productCount, totalPages };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: { category: { thumbnail: true }, materials: true, images: true, backgroundImage: true } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({ where: { slug }, relations: { category: { thumbnail: true }, materials: true, images: true, backgroundImage: true } });
    if (!product) throw new NotFoundException(`Product with slug ${slug} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id }, relations: { category: true, materials: true, images: true, backgroundImage: true } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    return this.createOrUpdateProduct(product, updateProductDto);
  }

  private async createOrUpdateProduct(product: Product, dto: CreateProductDto | UpdateProductDto) {
    if (dto.slug === undefined && dto instanceof CreateProductDto) {
      dto.slug = Utils.generateRandomString(4) + "-" + dto.name.toLowerCase();
    }

    if (dto.slug !== undefined) {
      dto.slug = Utils.slugify(dto.slug);

      const productBySlug = await this.productRepository.findOne({ where: { slug: dto.slug } });
      if (productBySlug && productBySlug.id !== product?.id)
        throw new BadRequestException("Slug with the name \"" + dto.slug + "\" already exists");
    }

    if (dto.categoryId !== undefined)
      product.category = dto.categoryId === null ? null : await this.categoryService.findOne(dto.categoryId);

    if (dto.materialIds !== undefined) {
      product.materials = [];

      for (const materialId of dto.materialIds) {
        const material = await this.materialService.findOne(materialId);
        product.materials.push(material);
      }
    }

    if (dto.imageIds !== undefined) {
      product.images = [];

      for (const imageId of dto.imageIds) {
        const image = await this.mediaService.findOne(imageId);
        product.images.push(image);
      }
    }

    if (dto.backgroundImageId !== undefined)
      product.backgroundImage = dto.backgroundImageId === null ? null : await this.mediaService.findOne(dto.backgroundImageId);

    return this.productRepository.save(this.productRepository.merge(product, dto));
  }

  async remove(id: number) {
    const result = await this.productRepository.delete(id);

    if (result.affected !== 1)
      throw new NotFoundException(`Product with id ${id} not found`);
  }
}
