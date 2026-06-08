import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  // 1. Função do Professor/Admin: Criar uma nova turma
  async createClass(
    name: string,
    code: string,
    teacherId: string,
  ): Promise<Class> {
    const newClass = this.classRepository.create({
      name,
      code,
      teacherId,
      studentIds: [], // Nasce sem nenhum aluno matriculado
    });
    return this.classRepository.save(newClass);
  }

  // 2. Função do Professor/Admin: Matricular um aluno na turma
  async enrollStudent(classId: string, studentId: string): Promise<Class> {
    const targetClass = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada.');
    }

    // Se o aluno já não estiver matriculado, adiciona ele na lista
    if (!targetClass.studentIds.includes(studentId)) {
      targetClass.studentIds.push(studentId);
    }

    return this.classRepository.save(targetClass);
  }

  // 3. Função do Professor: Ver as turmas que ELE ministra
  async findByTeacher(teacherId: string): Promise<Class[]> {
    return this.classRepository.find({ where: { teacherId } });
  }

  // 4. Função do Aluno: Ver as turmas em que ELE está matriculado
  async findByStudent(studentId: string): Promise<Class[]> {
    const allClasses = await this.classRepository.find();
    // Filtra apenas as turmas onde o array de alunos contém o ID desse aluno
    return allClasses.filter(
      (c) => c.studentIds && c.studentIds.includes(studentId),
    );
  }
}
