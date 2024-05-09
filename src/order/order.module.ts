import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAddress } from "src/user/entities/user-address.entity";
import { UserBasketItem } from "src/user/entities/user-basket.entity";
import { User } from "src/user/entities/user.entity";
import { OrderAddress } from "./entities/order-address.entity";
import { OrderProduct } from "./entities/order-product.entity";
import { Order } from "./entities/order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderAddress, OrderProduct, User, UserAddress, UserBasketItem])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule { }
