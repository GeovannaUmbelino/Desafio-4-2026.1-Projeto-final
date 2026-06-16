import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'text', default: UserRole.PROFESSOR })
  role!: UserRole;

  // Campo para matrícula (obrigatório para alunos, opcional para professores)
  @Column({ nullable: true })
  matricula?: string;

  // Permite desativar uma conta sem deletar
  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}