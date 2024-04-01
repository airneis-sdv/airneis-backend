import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Media {
  public static readonly MAX_SIZE = 1024 * 1024 * 10;
  public static readonly ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public filename: string;

  @Column({
    type: "enum",
    enum: Media.ALLOWED_TYPES
  })
  public type: string;

  @Column()
  public size: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
