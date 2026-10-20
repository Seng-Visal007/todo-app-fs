import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
