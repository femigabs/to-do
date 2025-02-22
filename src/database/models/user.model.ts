import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  Unique, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  OneToMany
} from 'typeorm';
import { TodoList } from './todo-list.model';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @OneToMany(() => TodoList, (todoList) => todoList.user)
  todoLists: TodoList[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}