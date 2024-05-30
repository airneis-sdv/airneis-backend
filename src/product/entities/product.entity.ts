import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { Material } from "../../material/entities/material.entity";
import { Media } from "../../media/entities/media.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public description?: string;

  @Column()
  public slug: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  public price: number;

  @Column()
  public stock: number;

  @Column({ default: 0 })
  public priority: number = 0;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Category, { nullable: true, cascade: true, onDelete: "SET NULL" })
  public category?: Category;

  @ManyToMany(() => Material)
  @JoinTable()
  public materials: Material[];

  @ManyToMany(() => Media)
  @JoinTable()
  public images: Media[];

  @ManyToOne(() => Media, { nullable: true })
  public backgroundImage?: Media;
}
