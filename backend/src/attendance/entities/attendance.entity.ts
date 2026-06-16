import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  classId!: string;

  @Column('uuid')
  teacherId!: string;

  // 💡 CORREÇÃO: Define e tipa a coluna que armazena o resultado JSON dos alunos presentes/ausentes
  @Column({ type: 'simple-json', nullable: true })
  studentsResult!: any;

  @Column({ type: 'text', nullable: true })
  date!: string;

  @CreateDateColumn()
  createdAt!: Date;
}