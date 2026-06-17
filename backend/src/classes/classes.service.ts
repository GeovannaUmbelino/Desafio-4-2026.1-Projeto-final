import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  // Cria e salva a turma de forma limpa usando a estrutura real da entidade
  async create(dto: any) {
    try {
      const novaTurma = this.classRepo.create({
        name: dto.name,
        code: dto.code,
        schedule: dto.schedule,
        teacherId: dto.teacherId,
        studentIds: [], // Inicializa a turma com o array de estudantes vazio
      });

      return await this.classRepo.save(novaTurma);
    } catch (error: any) {
      console.error('❌ [ERRO AO CRIAR TURMA] Falha ao salvar no SQLite:', error);
      throw new Error(`Não foi possível salvar a turma: ${error.message}`);
    }
  }

  // Realiza a matrícula do aluno atualizando o array JSON 'studentIds'
  async addStudent(classId: string, studentId: string) {
    try {
      const turma = await this.classRepo.findOne({ where: { id: classId } });
      if (!turma) throw new NotFoundException('Turma não localizada.');

      // Inicializa o array se ele estiver nulo por algum motivo
      let alunosAtuais: string[] = [];
      if (turma.studentIds) {
        if (typeof turma.studentIds === 'string') {
          try { alunosAtuais = JSON.parse(turma.studentIds); } catch { alunosAtuais = []; }
        } else if (Array.isArray(turma.studentIds)) {
          alunosAtuais = turma.studentIds;
        }
      }

      // Evita duplicar a matrícula do mesmo estudante normalizando as strings
      const idLimpo = String(studentId).trim().toLowerCase();
      const jaMatriculado = alunosAtuais.map(id => String(id).trim().toLowerCase()).includes(idLimpo);

      if (jaMatriculado) {
        return turma;
      }

      alunosAtuais.push(studentId);
      turma.studentIds = alunosAtuais;

      return await this.classRepo.save(turma);
    } catch (error: any) {
      console.error('❌ [ERRO MATRÍCULA] Falha ao injetar aluno no array:', error);
      throw new Error(`Erro ao matricular: ${error.message}`);
    }
  }

  // 💡 LISTAGEM INTELIGENTE: Agora aceita e filtra as matérias corretamente para Admin, Professor e Aluno!
  async findAll(user: any) {
    try {
      // Busca todas as disciplinas salvas no SQLite para fazer a filtragem segura
      const todasAsTurmas = await this.classRepo.find();

      if (!user) return todasAsTurmas;

      // 1. Se for Administrador, vê tudo completo
      if (user.role === 'admin') {
        return todasAsTurmas;
      }

      // 2. Se for Aluno, filtra se o ID dele está dentro da lista de matriculados (studentIds)
      if (user.role === 'aluno') {
        return todasAsTurmas.filter(turma => {
          if (!turma.studentIds) return false;
          let ids: string[] = [];
          
          try {
            if (typeof turma.studentIds === 'string') {
              const parsed = JSON.parse(turma.studentIds);
              ids = Array.isArray(parsed) ? parsed : [turma.studentIds];
            } else if (Array.isArray(turma.studentIds)) {
              ids = turma.studentIds;
            }
          } catch {
            ids = String(turma.studentIds).split(',');
          }

          return ids.map(id => String(id).trim().toLowerCase()).includes(String(user.id).trim().toLowerCase());
        });
      }

      // 3. Se for Professor, filtra as matérias onde o teacherId corresponde ao ID dele
      if (user.id) {
        return todasAsTurmas.filter(turma => String(turma.teacherId).trim() === String(user.id).trim());
      }

      return [];
    } catch (error: any) {
      console.error('❌ [ERRO LISTAGEM] Falha ao buscar disciplinas:', error.message);
      return [];
    }
  }

  // Detalha uma única turma
  async findOne(id: string) {
    try {
      const turma = await this.classRepo.findOne({ where: { id } });
      if (!turma) {
        throw new NotFoundException(`Turma com o ID ${id} não localizada.`);
      }
      return turma;
    } catch (error: any) {
      throw new NotFoundException(`Erro ao buscar turma: ${error.message}`);
    }
  }

  // Remove uma turma
  async remove(id: string) {
    const turma = await this.findOne(id);
    return await this.classRepo.remove(turma);
  }
}