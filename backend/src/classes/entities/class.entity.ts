import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid') // ID Único da Turma
  id!: string;

  @Column() // Nome da Turma
  name!: string;

  @Column({ unique: true }) // Código da  turma
  code!: string;

  @Column('uuid') // Guarda o UUID do Professor responsável (que vem de Users)
  teacherId!: string;

  // Armazena os UUIDs dos alunos matriculados
  @Column({ type: 'simple-json', nullable: true })
  studentIds!: string[];

  // Guarda o horário da turma
  @Column({ nullable: true })
  schedule!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
