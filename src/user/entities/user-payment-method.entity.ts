import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserPaymentMethod {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public label?: string;

  @Column()
  public fullName: string;

  @Column()
  @Exclude()
  public cardNumber: string;

  @Column()
  public expirationMonth: number;

  @Column()
  public expirationYear: number;

  @Column()
  @Exclude()
  public cvv: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  public user: User;
}
