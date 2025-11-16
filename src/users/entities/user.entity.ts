import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn, Generated } from "typeorm";
import { UserRoles } from "../utility/common/user-roles.enum";

@Entity('users')

export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;
    @Column({ type: 'enum', enum: UserRoles, default: [UserRoles.USER], array: true })

    roles: UserRoles[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

   

    
}
