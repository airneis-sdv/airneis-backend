import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  public price: number;

  @Column()
  public quantity: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Product, { nullable: true, cascade: true, onDelete: "SET NULL" })
  public product: Product;

  @ManyToOne(() => Order, (order) => order.products)
  public order: Order;
}
