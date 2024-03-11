import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAddress } from "./entities/user-address.entity";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress])],
  controllers: [UserController, UsersController],
  providers: [UserService, UsersService],
  exports: [UsersService],
})
export class UserModule { }
