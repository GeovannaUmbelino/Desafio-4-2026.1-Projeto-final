import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class!: Class;

  @Column()
  classId!: string;

  @Column({ type: 'text' })
  date!: string;

  @Column({ type: 'text' })
  presentStudents!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
