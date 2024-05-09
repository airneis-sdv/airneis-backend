import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../auth/enums/role.enum";
import { UserAddress } from "./user-address.entity";
import { UserBasketItem } from "./user-basket.entity";
import { UserPaymentMethod } from "./user-payment-method.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  public role: Role;

  @OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
  public addresses: UserAddress[];

  @OneToMany(() => UserPaymentMethod, (paymentMethod) => paymentMethod.user, { cascade: true })
  public paymentMethods: UserPaymentMethod[];

  @OneToMany(() => UserBasketItem, (basketItem) => basketItem.user, { cascade: true })
  public basket: UserBasketItem[];

  @ManyToOne(() => UserAddress, { nullable: true, cascade: true, onDelete: "SET NULL" })
  public defaultBillingAddress: UserAddress;

  @ManyToOne(() => UserAddress, { nullable: true, cascade: true, onDelete: "SET NULL" })
  public defaultShippingAddress: UserAddress;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
