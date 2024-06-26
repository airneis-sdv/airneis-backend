import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { ProductService } from "../product/product.service";
import { BasketDto } from "./dto/basket.dto";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { PasswordUpdateDto } from "./dto/password-update.dto";
import { QueryUserFiltersDto } from "./dto/query-user-filters.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserPaymentMethodDto } from "./dto/user-payment-method.dto";
import { UserAddress } from "./entities/user-address.entity";
import { UserBasketItem } from "./entities/user-basket.entity";
import { UserPaymentMethod } from "./entities/user-payment-method.entity";
import { User } from "./entities/user.entity";
import { AddressType } from "./enums/address-type.enum";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserAddress) private addressRepository: Repository<UserAddress>,
    @InjectRepository(UserBasketItem) private basketRepository: Repository<UserBasketItem>,
    @InjectRepository(UserPaymentMethod) private paymentMethodRepository: Repository<UserPaymentMethod>,
    private productService: ProductService) { }

  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.findOneByEmail(createUserDto.email);
    if (userByEmail) throw new ConflictException(`Email ${createUserDto.email} is already in use`);

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(filters: QueryUserFiltersDto) {
    const where: FindOptionsWhere<User> = {};
    if (filters.search)
      where.name = Like(`%${filters.search}%`);

    const userCount = await this.userRepository.count({ where });
    const totalPages = Math.ceil(userCount / filters.limit);

    if (filters.limit < 1 || filters.limit > 50)
      throw new BadRequestException("Limit must be between 1 and 50");

    if (filters.page && (filters.page < 1 || filters.page > totalPages))
      throw new BadRequestException("Page is out of bounds, max page is " + totalPages);

    const result = await this.userRepository.find({ where, take: filters.limit, skip: filters.page ? filters.limit * (filters.page - 1) : 0 });
    return { users: result, limit: filters.limit, page: filters.page ?? 1, userCount, totalPages };
  }

  async findOne(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { defaultBillingAddress: true, defaultShippingAddress: true } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);

    if (updateUserDto.email) {
      if (updateUserDto.email.toLowerCase() === user.email.toLowerCase())
        throw new BadRequestException("New email must be different from the current email");

      const userByEmail = await this.findOneByEmail(updateUserDto.email);
      if (userByEmail)
        throw new ConflictException(`Email ${updateUserDto.email} is already in use by another user`);
    }

    const dtoBillingAddress = updateUserDto.defaultBillingAddressId;
    if (dtoBillingAddress !== undefined) {
      user.defaultBillingAddress = null;

      if (dtoBillingAddress) {
        const address = await this.addressRepository.findOne({ where: { id: dtoBillingAddress, user: { id: userId } } });
        if (!address) throw new NotFoundException(`Address with id ${dtoBillingAddress} not found for user with id ${userId}`);

        if (address.type !== AddressType.BILLING) throw new BadRequestException(`Address with id ${dtoBillingAddress} is not a billing address`);

        user.defaultBillingAddress = address;
      }
    }

    const dtoShippingAddress = updateUserDto.defaultShippingAddressId;
    if (dtoShippingAddress !== undefined) {
      user.defaultShippingAddress = null;

      if (dtoShippingAddress) {
        const address = await this.addressRepository.findOne({ where: { id: dtoShippingAddress, user: { id: userId } } });
        if (!address) throw new NotFoundException(`Address with id ${dtoShippingAddress} not found for user with id ${userId}`);

        if (address.type !== AddressType.SHIPPING) throw new BadRequestException(`Address with id ${dtoShippingAddress} is not a shipping address`);

        user.defaultShippingAddress = address;
      }
    }

    return await this.userRepository.save(this.userRepository.merge(user, updateUserDto));
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
    const basket = await this.basketRepository.find({
      where: { user: { id: user.id } },
      relations: { product: { backgroundImage: true, category: { thumbnail: true }, images: true, materials: true } }
    });

    return { basket, basketPrice: basket.reduce((total, item) => total + item.product.price * item.quantity, 0) };
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

  async createPaymentMethod(userId: number, createPaymentMethodDto: UserPaymentMethodDto) {
    const user = await this.findOne(userId);
    let paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
    paymentMethod.user = user;

    paymentMethod = await this.paymentMethodRepository.save(paymentMethod);
    return this.paymentMethodAddLastDigits(paymentMethod);
  }

  async findAllPaymentMethods(userId: number) {
    const user = await this.findOne(userId);
    const paymentMethods = await this.paymentMethodRepository.find({ where: { user: { id: user.id } } });

    return this.paymentMethodAddLastDigits(paymentMethods);
  }

  async findOnePaymentMethod(userId: number, paymentMethodId: number) {
    const user = await this.findOne(userId);

    const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: paymentMethodId, user: { id: user.id } } });
    if (!paymentMethod) throw new NotFoundException(`Payment method with id ${paymentMethodId} not found for user with id ${userId}`);

    return this.paymentMethodAddLastDigits(paymentMethod);
  }

  async updatePaymentMethod(userId: number, paymentMethodId: number, updatePaymentMethodDto: UserPaymentMethodDto) {
    let paymentMethod = await this.findOnePaymentMethod(userId, paymentMethodId);
    paymentMethod = await this.paymentMethodRepository.save(this.paymentMethodRepository.merge(paymentMethod as UserPaymentMethod, updatePaymentMethodDto));

    return this.paymentMethodAddLastDigits(paymentMethod);
  }

  async removePaymentMethod(userId: number, paymentMethodId: number) {
    const paymentMethod = await this.findOnePaymentMethod(userId, paymentMethodId) as UserPaymentMethod;
    const result = await this.paymentMethodRepository.delete({ id: paymentMethod.id });

    if (result.affected !== 1)
      throw new InternalServerErrorException(`Failed to remove payment method with id ${paymentMethodId} for user with id ${userId}`);
  }

  private paymentMethodAddLastDigits(paymentMethod: UserPaymentMethod | UserPaymentMethod[]) {
    if (Array.isArray(paymentMethod)) {
      return paymentMethod.map((method: any) => {
        method.lastDigits = method.cardNumber.slice(-4);
        return method;
      });
    }

    (paymentMethod as any).lastDigits = paymentMethod.cardNumber.slice(-4);
    return paymentMethod;
  }
}
