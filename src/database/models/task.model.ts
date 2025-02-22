import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import { TodoList } from './todo-list.model';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    dueDate: Date;

    @Column({ default: 'pending' })
    status: string;

    @Column()
    todoListId: number;

    @ManyToOne(() => TodoList, (todoList) => todoList.tasks)
    todoList: TodoList;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
