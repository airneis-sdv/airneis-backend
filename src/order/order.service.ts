import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserAddress } from "src/user/entities/user-address.entity";
import { User } from "src/user/entities/user.entity";
import { Equal, FindOptionsWhere, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { QueryOrderFilters } from "./dto/query-order-filters";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderAddress } from "./entities/order-address.entity";
import { OrderProduct } from "./entities/order-product.entity";
import { Order } from "./entities/order.entity";
import { OrderStatus } from "./enums/order-status.enum";

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderAddress) private readonly orderAddressRepository: Repository<OrderAddress>,
    @InjectRepository(OrderProduct) private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress) private readonly addressRepository: Repository<UserAddress>) { }

  async createUserOrder(userId: number, createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { basket: { product: true } } });
    if (!user) throw new BadRequestException(`User with id ${userId} not found`);

    if (user.basket.length === 0) throw new BadRequestException("Empty basket");

    const billingAddress = await this.addressRepository.findOne({ where: { id: createOrderDto.billingAddressId, user: { id: user.id } } });
    if (!billingAddress) throw new BadRequestException(`Billing address with id ${createOrderDto.billingAddressId} not found for user with id ${user.id}`);

    const shippingAddress = await this.addressRepository.findOne({ where: { id: createOrderDto.shippingAddressId, user: { id: user.id } } });
    if (!shippingAddress) throw new BadRequestException(`Shipping address with id ${createOrderDto.shippingAddressId} not found for user with id ${user.id}`);

    const products = [];

    for (const basketItem of user.basket) {
      const orderProduct = this.orderProductRepository.create(basketItem.product);
      orderProduct.id = undefined;
      orderProduct.quantity = basketItem.quantity;
      orderProduct.product = basketItem.product;

      products.push(await this.orderProductRepository.save(orderProduct));
    }

    const order = this.orderRepository.create();
    order.user = user;
    order.billingAddress = await this.saveAddress(billingAddress);
    order.shippingAddress = await this.saveAddress(shippingAddress);
    order.products = products;

    const orderResult = await this.orderRepository.save(order);

    user.basket = [];
    await this.userRepository.save(user);

    return orderResult;
  }

  private async saveAddress(address: OrderAddress) {
    const orderAddress = this.orderAddressRepository.create(address);
    orderAddress.id = undefined;

    return this.orderAddressRepository.save(orderAddress);
  }

  async findAll(filters: QueryOrderFilters) {
    const where: FindOptionsWhere<Order> = {};

    if (filters.user) {
      const user = await this.userRepository.findOne({ where: { id: filters.user } });
      if (!user) throw new BadRequestException(`User with id ${filters.user} not found`)

      where.user = Equal(user.id);
    }

    const orderCount = await this.orderRepository.count({ where });
    const totalPages = Math.ceil(orderCount / filters.limit);

    if (filters.limit < 1 || filters.limit > 50)
      throw new BadRequestException("Limit must be between 1 and 50");

    if (filters.page && (filters.page < 1 || filters.page > totalPages))
      throw new BadRequestException("Page is out of bounds, max page is " + totalPages);

    const result = await this.orderRepository.find({
      where,
      take: filters.limit,
      skip: filters.page ? filters.limit * (filters.page - 1) : 0,
      order: { createdAt: filters.order as any },
      relations: { products: true, billingAddress: true, shippingAddress: true, user: true },
    });

    return { orders: result, limit: filters.limit, page: filters.page ?? 1, total: totalPages }
  }

  async findOne(orderId: number, userId?: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: { products: true, billingAddress: true, shippingAddress: true, user: true } });
    if (!order) throw new BadRequestException(`Order with id ${orderId} not found`);

    if (userId && order.user.id !== userId)
      throw new BadRequestException(`Order with id ${orderId} not found for user with id ${userId}`)

    return order;
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(orderId);
    order.status = updateOrderDto.status;

    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.findOne(orderId, userId);

    if (order.status === OrderStatus.CANCELED)
      throw new BadRequestException(`Order with id ${orderId} is already canceled`);

    const cancellableStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status))
      throw new BadRequestException(`Order with id ${orderId} cannot be canceled`);

    order.status = OrderStatus.CANCELED;

    return this.orderRepository.save(order);
  }
}
