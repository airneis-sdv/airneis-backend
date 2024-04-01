import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MaterialDto } from "./dto/material.dto";
import { Material } from "./entities/material.entity";

@Injectable()
export class MaterialService {
  constructor(@InjectRepository(Material) private materialRepository: Repository<Material>) { }

  create(materialDto: MaterialDto) {
    const material = this.materialRepository.create(materialDto);
    return this.materialRepository.save(material);
  }

  findAll() {
    return this.materialRepository.find();
  }

  async findOne(id: number) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) throw new NotFoundException(`Material with id ${id} not found`);

    return material;
  }

  async update(id: number, materialDto: MaterialDto) {
    const result = await this.materialRepository.update(id, materialDto);

    if (result.affected !== 1)
      throw new NotFoundException(`Material with id ${id} not found`);
  }

  async remove(id: number) {
    const result = await this.materialRepository.delete(id);

    if (result.affected !== 1)
      throw new NotFoundException(`Material with id ${id} not found`);
  }
}
