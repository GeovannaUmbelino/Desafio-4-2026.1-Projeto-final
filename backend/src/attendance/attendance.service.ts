import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  // Função criar chamada
  async create(createAttendanceDto: CreateAttendanceDto) {
    const { classId, date, presentStudents } = createAttendanceDto;

    const classExists = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classExists) {
      throw new NotFoundException(`Turma com ID ${classId} não encontrada`);
    }

    const attendance = this.attendanceRepository.create({
      classId,
      date,
      presentStudents: JSON.stringify(presentStudents),
    });

    return this.attendanceRepository.save(attendance);
  }

  // Função listar todas as chamadas
  async findAll() {
    return this.attendanceRepository.find({
      relations: { class: true },
    });
  }

  // Função buscar chamadas por turma (com filtro opcional de data)
  async findByClass(classId: string, startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      return this.attendanceRepository.find({
        where: {
          classId,
          date: Between(startDate, endDate),
        },
        order: { date: 'DESC' },
      });
    }

    return this.attendanceRepository.find({
      where: { classId },
      order: { date: 'DESC' },
    });
  }

  // Função gerar relatório estatístico da turma
  async getAttendanceReport(classId: string) {
    const attendances = await this.attendanceRepository.find({
      where: { classId },
      order: { date: 'ASC' },
    });

    const totalAulas = attendances.length;

    if (totalAulas === 0) {
      return {
        classId,
        totalAulas: 0,
        mediaFrequenciaTurma: 0,
        relatorioAlunos: [],
      };
    }

    const contagemPresencas: Record<string, number> = {};

    attendances.forEach((attendance) => {
      try {
        const presentes = JSON.parse(attendance.presentStudents) as string[];

        presentes.forEach((alunoId) => {
          contagemPresencas[alunoId] = (contagemPresencas[alunoId] || 0) + 1;
        });
      } catch (error) {
        console.error('Erro ao processar JSON de estudantes presentes:', error);
      }
    });

    let somaPorcentagens = 0;
    const relatorioAlunos = Object.keys(contagemPresencas).map((alunoId) => {
      const presencas = contagemPresencas[alunoId];
      const faltas = totalAulas - presencas;
      const porcentagemFrequencia = Math.round((presencas / totalAulas) * 100);

      somaPorcentagens += porcentagemFrequencia;

      return {
        alunoId,
        presencas,
        faltas,
        porcentagemFrequencia,
        status: porcentagemFrequencia >= 75 ? 'Regular' : 'Risco de Reprovação',
      };
    });

    const mediaFrequenciaTurma =
      relatorioAlunos.length > 0
        ? Math.round(somaPorcentagens / relatorioAlunos.length)
        : 0;

    return {
      classId,
      totalAulas,
      mediaFrequenciaTurma: `${mediaFrequenciaTurma}%`,
      relatorioAlunos,
    };
  }
}
