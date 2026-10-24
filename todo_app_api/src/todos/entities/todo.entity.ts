import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity.js";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 200})
    title: string;
    @Column({default: "TODO"})
    status: string;
    @Column({ default: false })
    starred: boolean;
    @Column({ name: "sort_order", type: "integer", default: 0 })
    sortOrder: number;

    @ManyToOne(() => User, (user) => user.todos, { nullable: false })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @Column()
    ownerId: string;
}
