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

  @Column() // Nome da Turma / Disciplina (ex: "Laboratório de Química")
  name!: string;

  @Column() // Código ou sala da turma (ex: "LAB-03" ou "TURMA-A")
  code!: string;

  @Column('uuid') // Guarda o UUID do Professor responsável (que vem de Users)
  teacherId!: string;

  // Armazena os UUIDs dos alunos matriculados como um array de textos (JSON)
  @Column({ type: 'simple-json', nullable: true })
  studentIds!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
