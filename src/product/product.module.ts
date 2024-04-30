import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "../category/category.module";
import { MaterialModule } from "../material/material.module";
import { MediaModule } from "../media/media.module";
import { Product } from "./entities/product.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, MaterialModule, MediaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
