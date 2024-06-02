import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderAddress } from "./order-address.entity";
import { OrderProduct } from "./order-product.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, { cascade: true, onDelete: "SET NULL" })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  public status: OrderStatus;

  @ManyToOne(() => OrderAddress)
  public billingAddress: OrderAddress;

  @ManyToOne(() => OrderAddress)
  public shippingAddress: OrderAddress;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  public products: OrderProduct[];
}
