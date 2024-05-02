import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Like, Repository } from "typeorm";
import { ProductService } from "../product/product.service";
import { BasketDto } from "./dto/basket.dto";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { PasswordUpdateDto } from "./dto/password-update.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserAddress } from "./entities/user-address.entity";
import { UserBasketItem } from "./entities/user-basket.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAddress) private addressRepository: Repository<UserAddress>,
    @InjectRepository(UserBasketItem) private basketRepository: Repository<UserBasketItem>,
    private productService: ProductService) { }

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

  async findOne(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(userId, updateUserDto);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${userId} not found`);
  }

  async updatePassword(userId: number, passwordUpdateDto: PasswordUpdateDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const isOldPasswordCorrect = await bcrypt.compare(passwordUpdateDto.oldPassword, user.password);
    if (!isOldPasswordCorrect) throw new UnauthorizedException("Old password is incorrect");

    if (passwordUpdateDto.oldPassword === passwordUpdateDto.newPassword)
      throw new BadRequestException("New password must be different from the old password");

    const newPassword = await bcrypt.hash(passwordUpdateDto.newPassword, 10);
    const result = await this.userRepository.update(userId, { password: newPassword });

    if (result.affected !== 1)
      throw new InternalServerErrorException(`Failed to update password for user with id ${userId}`);
  }

  async remove(userId: number) {
    const result = await this.userRepository.delete(userId);

    if (result.affected !== 1)
      throw new NotFoundException(`User with id ${userId} not found`);
  }

  async createAddress(userId: number, createAddressDto: CreateUserAddressDto) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const address = this.addressRepository.create(createAddressDto);
    user.addresses.push(address);

    await this.userRepository.save(user);
    return address;
  }

  async findAllAddresses(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { addresses: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

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

  async getBasketItems(userId: number) {
    const user = await this.findOne(userId);

    return this.basketRepository.find({
      where: { user: { id: user.id } },
      relations: { product: { backgroundImage: true, category: { thumbnail: true }, images: true, materials: true } }
    });
  }

  async addBasketItem(userId: number, basketDto: BasketDto) {
    const user = await this.findOne(userId);
    const product = await this.productService.findOne(basketDto.productId);

    const existingItem = await this.basketRepository.count({ where: { user: { id: user.id }, product: { id: product.id } } });
    if (existingItem)
      throw new ConflictException(`Product with id ${basketDto.productId} is already in the basket`);

    return this.basketRepository.save({ user, product, quantity: basketDto.quantity });
  }

  async updateBasketItem(userId: number, basketDto: BasketDto) {
    const user = await this.findOne(userId);
    const product = await this.productService.findOne(basketDto.productId);

    const existingItem = await this.basketRepository.count({ where: { user: { id: user.id }, product: { id: product.id } } });
    if (!existingItem) throw new NotFoundException(`Product with id ${basketDto.productId} is not in the basket`);

    return this.basketRepository.update({ user, product }, { quantity: basketDto.quantity });
  }

  async removeBasketItem(userId: number, productId: number) {
    const user = await this.findOne(userId);
    const product = await this.productService.findOne(productId);

    const existingItem = await this.basketRepository.count({ where: { user: { id: user.id }, product: { id: product.id } } });
    if (!existingItem) throw new NotFoundException(`Product with id ${productId} is not in the basket`);

    return this.basketRepository.delete({ user, product });
  }

  async clearBasket(userId: number) {
    const user = await this.findOne(userId);
    return this.basketRepository.delete({ user });
  }
}
