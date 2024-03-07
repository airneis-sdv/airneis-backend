import { Exclude } from "class-transformer";
import { Role } from "src/common/constants/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
