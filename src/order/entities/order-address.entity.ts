import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class OrderAddress {
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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
