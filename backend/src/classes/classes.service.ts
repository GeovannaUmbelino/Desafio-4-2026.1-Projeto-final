import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  // 1. Criar uma nova turma
  async createClass(
    name: string,
    code: string,
    teacherId: string,
    schedule: string,
  ): Promise<Class> {
    const newClass = this.classRepository.create({
      name,
      code,
      teacherId,
      schedule,
      studentIds: [],
    });
    return this.classRepository.save(newClass);
  }

  // 2. Matricular um aluno na turma
  async enrollStudent(classId: string, studentId: string): Promise<Class> {
    const targetClass = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada.');
    }

    if (!targetClass.studentIds) {
      targetClass.studentIds = [];
    }

    if (!targetClass.studentIds.includes(studentId)) {
      targetClass.studentIds.push(studentId);
    }

    return this.classRepository.save(targetClass);
  }

  // 3. Ver as turmas de um Professor
  async findByTeacher(teacherId: string): Promise<Class[]> {
    return this.classRepository.find({ where: { teacherId } });
  }

  // 4. Ver as turmas de um Aluno
  async findByStudent(studentId: string): Promise<Class[]> {
    const allClasses = await this.classRepository.find();
    return allClasses.filter(
      (c) => c.studentIds && c.studentIds.includes(studentId),
    );
  }

  // 5. Editar dados de uma turma (Nome, Código, etc.)
  async updateClass(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada para atualização.');
    }

    // Mescla as alterações vindas do DTO na turma encontrada
    Object.assign(targetClass, updateClassDto);
    return this.classRepository.save(targetClass);
  }

  // 6. Deletar uma turma do sistema
  async removeClass(id: string): Promise<void> {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada para exclusão.');
    }
    await this.classRepository.remove(targetClass);
  }

  // 7. Buscar dados gerais da turma incluindo a lista de alunos vinculados
  async getClassDashboardData(id: string) {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada.');
    }

    return {
      id: targetClass.id,
      name: targetClass.name,
      code: targetClass.code,
      schedule: targetClass.schedule,
      totalStudents: targetClass.studentIds ? targetClass.studentIds.length : 0,
      studentIds: targetClass.studentIds || [],
    };
  }
}
