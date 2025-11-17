import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  category: string;
}
