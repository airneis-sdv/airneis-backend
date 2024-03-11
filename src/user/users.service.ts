import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Like, Repository } from "typeorm";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserAddress } from "./entities/user-address.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAddress) private addressRepository: Repository<UserAddress>) { }

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

  async createAddress(id: number, createAddressDto: CreateUserAddressDto) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const address = this.addressRepository.create(createAddressDto);
    user.addresses.push(address);

    await this.userRepository.save(user);
  }

  async findAllAddresses(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user.addresses;
  }

  async findOneAddress(userId: number, addressId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const address = user.addresses.find((address) => address.id === addressId);
    if (!address) throw new NotFoundException(`Address with id ${addressId} not found for user with id ${userId}`);

    return address;
  }

  async updateAddress(userId: number, addressId: number, updateAddressDto: UpdateUserAddressDto) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const address = user.addresses.find((address) => address.id === addressId);
    if (!address) throw new NotFoundException(`Address with id ${addressId} not found for user with id ${userId}`);

    const updatedAddress = this.addressRepository.create(updateAddressDto);
    updatedAddress.id = addressId;

    await this.addressRepository.save(updatedAddress);
  }

  async removeAddress(userId: number, addressId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const address = user.addresses.find((address) => address.id === addressId);
    if (!address) throw new NotFoundException(`Address with id ${addressId} not found for user with id ${userId}`);

    user.addresses = user.addresses.filter((address) => address.id !== addressId);

    await this.userRepository.save(user);
  }
}
