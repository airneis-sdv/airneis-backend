import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderModule } from "src/order/order.module";
import { ProductModule } from "../product/product.module";
import { UserAddress } from "./entities/user-address.entity";
import { UserBasketItem } from "./entities/user-basket.entity";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress, UserBasketItem]), OrderModule, ProductModule],
  controllers: [UserController, UsersController],
  providers: [UserService, UsersService],
  exports: [UsersService],
})
export class UserModule { }
