import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { TurmaReal } from './useClasses';

export interface MinhaMateria {
  turma: TurmaReal;
  presencas: number;
  totalAulas: number;
}

export function useStudentData() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<MinhaMateria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Busca todas as turmas e filtra as que o aluno está matriculado
      const { data: todasTurmas } = await api.get<TurmaReal[]>('/classes/all');

      const minhasTurmas = todasTurmas.filter(
        (t) => t.studentIds && t.studentIds.includes(user.id),
      );

      // Para cada turma, busca as chamadas e calcula presença do aluno
      const materiasComPresenca = await Promise.all(
        minhasTurmas.map(async (turma) => {
          try {
            const { data: chamadas } = await api.get<any[]>(`/attendance/turma/${turma.id}`);
            const totalAulas = chamadas.length;
            const presencas = chamadas.filter((c) => {
              try {
                const presentes: string[] = JSON.parse(c.presentStudents);
                return presentes.includes(user.id);
              } catch {
                return false;
              }
            }).length;
            return { turma, presencas, totalAulas };
          } catch {
            return { turma, presencas: 0, totalAulas: 0 };
          }
        }),
      );

      setMaterias(materiasComPresenca);
    } catch (error) {
      console.error('Erro ao buscar dados do aluno:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  return { materias, isLoading };
}
