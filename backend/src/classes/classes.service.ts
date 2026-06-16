import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';



@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}



  // Criar uma nova turma 
  async create(dto: CreateClassDto): Promise<Class> {
    const newClass = this.classRepository.create({
      ...dto,
      studentIds: [], // Inicializa a lista de alunos vazia
    });
    return this.classRepository.save(newClass);
  }


  async findAll(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async findOne(id: string): Promise<Class> {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada.');
    }
    return targetClass;
  }


  async findByTeacher(teacherId: string): Promise<Class[]> {
    return this.classRepository.find({ where: { teacherId } });
  }

 // Editar dados de uma turma
  async update(id: string, dto: UpdateClassDto): Promise<Class> {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada para atualização.');
    }
    

    Object.assign(targetClass, dto);
    return this.classRepository.save(targetClass);
  }

  // Deletar uma turma do sistema
  async remove(id: string): Promise<void> {
    const targetClass = await this.classRepository.findOne({ where: { id } });
    if (!targetClass) {
      throw new NotFoundException('Turma não encontrada para exclusão.');
    }
    await this.classRepository.remove(targetClass);
  }



  // Matricular um aluno na turma
  async enrollStudent(classId: string, studentId: string): Promise<Class> {
    const targetClass = await this.classRepository.findOne({ where: { id: classId } });
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

 
  async findByStudent(studentId: string): Promise<Class[]> {
    const allClasses = await this.classRepository.find();
    return allClasses.filter(
      (c) => c.studentIds && c.studentIds.includes(studentId),
    );
  }



  

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