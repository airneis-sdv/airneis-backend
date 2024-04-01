import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AddressType } from "../enums/address-type.enum";
import { User } from "./user.entity";

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public address1: string;

  @Column({ nullable: true })
  public address2: string | null;

  @Column()
  public city: string;

  @Column()
  public region: string;

  @Column()
  public postalCode: string;

  @Column()
  public country: string;

  @Column()
  public phone: string;

  @Column({ type: "enum", enum: AddressType })
  public type: AddressType;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  public user: User;
}
