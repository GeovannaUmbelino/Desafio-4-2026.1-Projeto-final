import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';

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

  // Registrar nova chamada física no banco SQLite
  async create(dto: any, user: any) {
    try {
      const novaChamada = this.attendanceRepo.create({
        classId: dto.classId,
        teacherId: user.id,
        studentsResult: dto.students || dto.studentsResult || [],
        date: dto.date || new Date().toISOString().split('T')[0],
      });
      return await this.attendanceRepo.save(novaChamada);
    } catch (error: any) {
      throw new Error(`Falha ao registrar chamada: ${error.message}`);
    }
  }

  // Estatísticas da Dashboard Principal (Blindado contra divisões por zero, NaN e Sensibilidade de Strings)
  async getDashboardStats(user: any) {
    try {
      // 1. Filtra as turmas permitidas conforme o nível de acesso do usuário
      const turmas = user.role === 'admin' 
        ? await this.classRepo.find() 
        : await this.classRepo.find({ where: { teacherId: user.id } });

      if (!turmas || turmas.length === 0) {
        return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 100, baixaFrequencia: [] };
      }

      const classIdsValidos = turmas.map(t => String(t.id).trim().toLowerCase());

      // 2. Coleta chamadas e usuários do banco para processamento analítico
      const todasAsChamadas = await this.attendanceRepo.find();
      const todosUsuarios = await this.userRepo.find();
      const todosAlunos = todosUsuarios.filter(u => u.role === 'aluno');
      
      const chamadasValidas = todasAsChamadas.filter(c => 
        classIdsValidos.includes(String(c.classId).trim().toLowerCase())
      );

      let totalAlunosContados = 0;
      const mapaTurmasAlunos: Record<string, string[]> = {};

      turmas.forEach(t => {
        let matriculadosIds: string[] = [];
        if (t.studentIds) {
          try {
            if (typeof t.studentIds === 'string') {
              matriculadosIds = JSON.parse(t.studentIds);
            } else if (Array.isArray(t.studentIds)) {
              matriculadosIds = t.studentIds;
            }
          } catch {
            matriculadosIds = [];
          }
        }
        // Normaliza todos os IDs dos alunos matriculados para minúsculo
        mapaTurmasAlunos[String(t.id).trim().toLowerCase()] = matriculadosIds.map(id => String(id).trim().toLowerCase());
        totalAlunosContados += matriculadosIds.length;
      });

      let totalPresencas = 0;
      let totalRegistros = 0;
      const alunosAlerta: any[] = [];

      // 3. Processa a frequência individual de cada aluno cruzando dados de forma limpa
      todosAlunos.forEach(aluno => {
        let presencasDoAluno = 0;
        let chamadasDoAluno = 0;
        let nomeMateriaExibicao = '';
        const alunoIdLimpo = String(aluno.id).trim().toLowerCase();

        chamadasValidas.forEach(chamada => {
          const chamadaClassIdLimpo = String(chamada.classId).trim().toLowerCase();
          const alunosDaTurma = mapaTurmasAlunos[chamadaClassIdLimpo] || [];
          
          // Verifica se o aluno pertence à turma da chamada
          if (alunosDaTurma.includes(alunoIdLimpo)) {
            let listaAlunos: any[] = [];
            if (typeof chamada.studentsResult === 'string') {
              try { listaAlunos = JSON.parse(chamada.studentsResult); } catch { listaAlunos = []; }
            } else if (Array.isArray(chamada.studentsResult)) {
              listaAlunos = chamada.studentsResult;
            } else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
              listaAlunos = Object.values(chamada.studentsResult);
            }

            // Busca o registro do aluno de forma flexível (por id, studentId ou nome)
            const registro = listaAlunos.find((a: any) => 
              String(a.id).trim().toLowerCase() === alunoIdLimpo || 
              String(a.studentId).trim().toLowerCase() === alunoIdLimpo ||
              String(a.name).toLowerCase().trim() === String(aluno.name).toLowerCase().trim()
            );

            if (registro) {
              chamadasDoAluno++;
              const correspondenteTurma = turmas.find(t => String(t.id).trim().toLowerCase() === chamadaClassIdLimpo);
              if (correspondenteTurma) nomeMateriaExibicao = correspondenteTurma.name;

              if (registro.status === 'presente' || registro.presente === true || String(registro.status).toLowerCase() === 'presente') {
                presencasDoAluno++;
                totalPresencas++;
              }
              totalRegistros++;
            }
          }
        });

        // Avalia risco real do estudante se ele tiver pelo menos 1 aula registrada na turma dele
        if (chamadasDoAluno > 0) {
          const percentualIndividual = Math.round((presencasDoAluno / chamadasDoAluno) * 100);
          
          if (percentualIndividual < 75) {
            alunosAlerta.push({
              id: aluno.id,
              name: aluno.name,
              matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
              classCode: nomeMateriaExibicao || "Disciplina",
              percentage: percentualIndividual,
              absences: chamadasDoAluno - presencasDoAluno
            });
          }
        }
      });

      // Se houver chamadas mas ninguém pontuou, joga a média para 0. Se não houver aulas nenhuma, mantém 100% limpo.
      const mediaRealCalculada = totalRegistros > 0 
        ? Math.round((totalPresencas / totalRegistros) * 100) 
        : (todasAsChamadas.length > 0 ? 0 : 100);

      return {
        totalAlunos: totalAlunosContados > 0 ? totalAlunosContados : todosAlunos.length,
        totalTurmas: turmas.length,
        mediaPresenca: mediaRealCalculada,
        baixaFrequencia: alunosAlerta.sort((a, b) => a.percentage - b.percentage),
      };
    } catch (error) {
      console.error("[Dashboard Error] Erro ao processar sumário da dashboard:", error);
      return { totalAlunos: 0, totalTurmas: 0, mediaPresenca: 0, baixaFrequencia: [] };
    }
  }

  // Listar todas as chamadas arquivadas
  async findAll() {
    return await this.attendanceRepo.find();
  }

  // Filtrar diários de presença por turma
  async findByClass(classId: string, startDate?: string, endDate?: string) {
    return await this.attendanceRepo.find({ where: { classId } });
  }

  // Consolidação Completa de Relatórios Analíticos (Resiliente e Sem Divisão por Zero)
  async getClasseReport(classId: string) {
    try {
      // 1. Localiza a disciplina alvo
      const turma = await this.classRepo.findOne({ where: { id: classId } });
      if (!turma) {
        throw new NotFoundException('Turma não localizada no sistema.');
      }

      // 2. Coleta e filtra as chamadas higienizando strings
      const todasAsChamadas = await this.attendanceRepo.find();
      const chamadas = todasAsChamadas.filter(c => String(c.classId).trim() === String(classId).trim());

      console.log(`[Relatório] Processando ${turma.name} | Chamadas encontradas: ${chamadas.length}`);

      // 3. Decodifica o array stringificado de matrículas
      let matriculadosIds: string[] = [];
      if (turma.studentIds) {
        if (typeof turma.studentIds === 'string') {
          try { matriculadosIds = JSON.parse(turma.studentIds); } catch { matriculadosIds = []; }
        } else if (Array.isArray(turma.studentIds)) {
          matriculadosIds = turma.studentIds;
        }
      }

      // 4. Mapeia e cruza dados dos estudantes cadastrados
      let alunosFisicos: User[] = [];
      const todosUsuarios = await this.userRepo.find();
      
      alunosFisicos = todosUsuarios.filter(u => 
        u.role === 'aluno' && 
        matriculadosIds.map(String).includes(String(u.id))
      );

      // Fallback institucional: Se os IDs falharem por desalinhamento, traz os alunos ativos
      if (alunosFisicos.length === 0) {
        alunosFisicos = todosUsuarios.filter(u => u.role === 'aluno');
      }

      // Cenário Alternativo: Se a turma possuir zero chamadas executadas até então
      if (!chamadas || chamadas.length === 0) {
        const studentAttendanceVazio = alunosFisicos.map(aluno => ({
          id: aluno.id,
          name: aluno.name,
          matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
          percentage: 0,
          presences: 0,
          absences: 0,
        }));

        return {
          mediaPresenca: 0,
          totalAlunos: alunosFisicos.length,
          chamadasRealizadas: 0,
          attendanceByDate: [],
          studentAttendance: studentAttendanceVazio
        };
      }

      let totalPresencasGerais = 0;
      let totalRegistrosGerais = 0;

      // 5. Estrutura o array histórico por datas para montagem dos gráficos
      const attendanceByDate = chamadas.map(chamada => {
        let listaAlunos: any[] = [];
        if (typeof chamada.studentsResult === 'string') {
          try { listaAlunos = JSON.parse(chamada.studentsResult); } catch { listaAlunos = []; }
        } else if (Array.isArray(chamada.studentsResult)) {
          listaAlunos = chamada.studentsResult;
        } else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
          listaAlunos = Object.values(chamada.studentsResult);
        }

        const presentes = listaAlunos.filter((a: any) => 
          a.status === 'presente' || a.presente === true || String(a.status).toLowerCase() === 'presente'
        ).length;
        
        const total = listaAlunos.length || alunosFisicos.length || 1;

        totalPresencasGerais += presentes;
        totalRegistrosGerais += total;

        let dataExibicao = chamada.date;
        if (!dataExibicao && (chamada as any).createdAt) {
          dataExibicao = new Date((chamada as any).createdAt).toISOString().split('T')[0];
        }
        if (dataExibicao && dataExibicao.includes('-')) {
          dataExibicao = dataExibicao.split('-').reverse().join('/');
        }

        return {
          date: dataExibicao || 'Data Indefinida',
          percentage: total > 0 ? Math.round((presentes / total) * 100) : 0
        };
      });

      // 6. Estrutura a listagem detalhada por aluno para preenchimento de tabelas e exportação
      const studentAttendance = alunosFisicos.map(aluno => {
        let presencasDoAluno = 0;

        chamadas.forEach(chamada => {
          let listaAlunos: any[] = [];
          if (typeof chamada.studentsResult === 'string') {
            try { listaAlunos = JSON.parse(chamada.studentsResult); } catch { listaAlunos = []; }
          } else if (Array.isArray(chamada.studentsResult)) {
            listaAlunos = chamada.studentsResult;
          } else if (chamada.studentsResult && typeof chamada.studentsResult === 'object') {
            listaAlunos = Object.values(chamada.studentsResult);
          }

          const registro = listaAlunos.find((a: any) => 
            String(a.id).trim() === String(aluno.id).trim() || 
            String(a.studentId).trim() === String(aluno.id).trim() ||
            String(a.name).toLowerCase().trim() === String(aluno.name).toLowerCase().trim()
          );

          if (registro && (registro.status === 'presente' || registro.presente === true || String(registro.status).toLowerCase() === 'presente')) {
            presencasDoAluno++;
          }
        });

        const totalDeChamadas = chamadas.length;
        const absences = totalDeChamadas - presencasDoAluno;
        const percentage = totalDeChamadas > 0 ? Math.round((presencasDoAluno / totalDeChamadas) * 100) : 0;

        return {
          id: aluno.id,
          name: aluno.name,
          matricula: aluno.matricula || String(aluno.id).substring(0, 8).toUpperCase(),
          percentage: percentage,
          presences: presencasDoAluno,
          absences: absences >= 0 ? absences : 0
        };
      });

      const mediaGeralCalculada = totalRegistrosGerais > 0 
        ? Math.round((totalPresencasGerais / totalRegistrosGerais) * 100) 
        : 0;

      return {
        mediaPresenca: mediaGeralCalculada || 0,
        totalAlunos: alunosFisicos.length,
        chamadasRealizadas: chamadas.length,
        attendanceByDate: attendanceByDate,
        studentAttendance: studentAttendance
      };

    } catch (error: any) {
      console.error("[Relatório Error] Falha crítica na consolidação de diários reais:", error);
      return { mediaPresenca: 0, totalAlunos: 0, chamadasRealizadas: 0, attendanceByDate: [], studentAttendance: [] };
    }
  }
}