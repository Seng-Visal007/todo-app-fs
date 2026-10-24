import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Todo } from "../../todos/entities/todo.entity.js";

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    passwordHash: string;

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role;

    @OneToMany(() => Todo, (todo) => todo.owner)
    todos: Todo[];
}
