import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Like, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.findOneByEmail(createUserDto.email);
    if (userByEmail) throw new ConflictException(`Email ${createUserDto.email} is already in use`);

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findAllBySearch(search: string) {
    if (search.length < 3)
      throw new BadRequestException("Search query must be at least 3 characters long");

    return this.userRepository.find({
      where: [
        { name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${id} not found`);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${id} not found`);
  }
}
