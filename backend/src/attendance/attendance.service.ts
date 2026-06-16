import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Class } from '../classes/entities/class.entity';
import { User, UserRole } from '../users/entities/user.entity';

export interface AttendanceRecord {
  studentId: string;
  present: boolean;
}

export interface SubmitAttendancePayload {
  classId: string;
  date: string; 
  records: AttendanceRecord[];
}


export interface DashboardStats {
  totalAlunos: number;
  totalTurmas: number;
  mediaPresenca: number; 
  baixaFrequencia: {
    alunoId: string;
    presencas: number;
    totalAulas: number;
    porcentagem: number;
  }[];
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Criação da chamada 

  async create(dto: CreateAttendanceDto) {
    const classExists = await this.classRepo.findOne({
      where: { id: dto.classId },
    });
    if (!classExists) {
      throw new NotFoundException(`Turma com ID "${dto.classId}" não encontrada.`);
    }

    const attendance = this.attendanceRepo.create({
      classId: dto.classId,
      date: dto.date,
      presentStudents: JSON.stringify(dto.presentStudents),
    });

    return this.attendanceRepo.save(attendance);
  }


  async submitAttendance(
    payload: SubmitAttendancePayload,
    professor: User,
  ): Promise<Attendance> {
    const classExists = await this.classRepo.findOne({
      where: { id: payload.classId },
    });
    if (!classExists) {
      throw new NotFoundException(
        `Turma com ID "${payload.classId}" não encontrada.`,
      );
    }

    // Filtra apenas os alunos presentes
    const presentIds = payload.records
      .filter((r) => r.present)
      .map((r) => r.studentId);

    const attendance = this.attendanceRepo.create({
      classId: payload.classId,
      date: payload.date,
      presentStudents: JSON.stringify(presentIds),
    });

    const saved = await this.attendanceRepo.save(attendance);

   
    console.log(
      `[Chamada] Professor ${professor.name} registrou chamada na turma ` +
        `${classExists.name} em ${payload.date}. ` +
        `Presentes: ${presentIds.length}/${payload.records.length}`,
    );

    return saved;
  }

  async getDashboardStats(
    requester: User,
  ): Promise<DashboardStats> {
    // 1. Busca turmas relevantes
    let turmas: Class[];
    if (requester.role === UserRole.ADMIN) {
      turmas = await this.classRepo.find();
    } else {
      // Professor vê apenas suas turmas
      turmas = await this.classRepo.find({
        where: { teacherId: requester.id },
      });
    }

    const totalTurmas = turmas.length;

    if (totalTurmas === 0) {
      return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 0, baixaFrequencia: [] };
    }

    
    const todosStudentIds = new Set<string>();
    turmas.forEach((t) => {
      (t.studentIds ?? []).forEach((id) => todosStudentIds.add(id));
    });
    const totalAlunos = todosStudentIds.size;

    
    const classIds = turmas.map((t) => t.id);
    const todasChamadas = await this.attendanceRepo
      .createQueryBuilder('a')
      .where('a.classId IN (:...ids)', { ids: classIds })
      .getMany();

    if (todasChamadas.length === 0) {
      return { totalAlunos, totalTurmas, mediaPresenca: 0, baixaFrequencia: [] };
    }

    
    const presencaCount: Record<string, { presencas: number; totalAulas: number }> = {};

    // Inicializa todos os alunos com 0
    todosStudentIds.forEach((sid) => {
      presencaCount[sid] = { presencas: 0, totalAulas: 0 };
    });

    // Agrupa chamadas por turma para contar total de aulas por aluno
    const chamadasPorTurma: Record<string, Attendance[]> = {};
    todasChamadas.forEach((c) => {
      if (!chamadasPorTurma[c.classId]) chamadasPorTurma[c.classId] = [];
      chamadasPorTurma[c.classId].push(c);
    });

    turmas.forEach((turma) => {
      const chamadas = chamadasPorTurma[turma.id] ?? [];
      const alunosDaTurma = turma.studentIds ?? [];

      chamadas.forEach((chamada) => {
        let presentes: string[] = [];
        try { presentes = JSON.parse(chamada.presentStudents); } catch { /* ignora */ }

        alunosDaTurma.forEach((sid) => {
          if (!presencaCount[sid]) presencaCount[sid] = { presencas: 0, totalAulas: 0 };
          presencaCount[sid].totalAulas += 1;
          if (presentes.includes(sid)) presencaCount[sid].presencas += 1;
        });
      });
    });

    // Calcula média geral e alunos em baixa frequência
    const porcentagens: number[] = [];
    const baixaFrequencia: DashboardStats['baixaFrequencia'] = [];

    Object.entries(presencaCount).forEach(([alunoId, stat]) => {
      if (stat.totalAulas === 0) return;
      const pct = Math.round((stat.presencas / stat.totalAulas) * 100);
      porcentagens.push(pct);

      if (pct < 75) {
        baixaFrequencia.push({
          alunoId,
          presencas: stat.presencas,
          totalAulas: stat.totalAulas,
          porcentagem: pct,
        });
      }
    });

    const mediaPresenca =
      porcentagens.length > 0
        ? Math.round(porcentagens.reduce((a, b) => a + b, 0) / porcentagens.length)
        : 0;

    baixaFrequencia.sort((a, b) => a.porcentagem - b.porcentagem);

    return { totalAlunos, totalTurmas, mediaPresenca, baixaFrequencia };
  }

  

  async findAll() {
    return this.attendanceRepo.find({ relations: { class: true } });
  }

  async findByClass(classId: string, startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      return this.attendanceRepo.find({
        where: { classId, date: Between(startDate, endDate) },
        order: { date: 'DESC' },
      });
    }
    return this.attendanceRepo.find({
      where: { classId },
      order: { date: 'DESC' },
    });
  }

  async getAttendanceReport(classId: string) {
    const attendances = await this.attendanceRepo.find({
      where: { classId },
      order: { date: 'ASC' },
    });
    const totalAulas = attendances.length;
    if (totalAulas === 0) {
      return { classId, totalAulas: 0, mediaFrequenciaTurma: '0%', relatorioAlunos: [] };
    }
    const contagemPresencas: Record<string, number> = {};
    attendances.forEach((a) => {
      try {
        (JSON.parse(a.presentStudents) as string[]).forEach((id) => {
          contagemPresencas[id] = (contagemPresencas[id] ?? 0) + 1;
        });
      } catch { /* ignora */ }
    });
    let soma = 0;
    const relatorioAlunos = Object.entries(contagemPresencas).map(([alunoId, presencas]) => {
      const pct = Math.round((presencas / totalAulas) * 100);
      soma += pct;
      return {
        alunoId,
        presencas,
        faltas: totalAulas - presencas,
        porcentagemFrequencia: pct,
        status: pct >= 75 ? 'Regular' : 'Risco de Reprovação',
      };
    });
    const media = relatorioAlunos.length > 0 ? Math.round(soma / relatorioAlunos.length) : 0;
    return { classId, totalAulas, mediaFrequenciaTurma: `${media}%`, relatorioAlunos };
  }
}
