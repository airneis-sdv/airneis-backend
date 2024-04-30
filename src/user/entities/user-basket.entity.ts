import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { User } from "./user.entity";

@Entity({ name: "user_basket" })
export class UserBasketItem {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  public user: User;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  public product: Product;

  @Column()
  public quantity: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
