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
      // 💡 CORREÇÃO 1: Tenta buscar em '/classes' caso '/classes/all' não esteja registrada
      let todasTurmas: TurmaReal[] = [];
      try {
        const response = await api.get<TurmaReal[]>('/classes');
        todasTurmas = response.data;
      } catch {
        const response = await api.get<TurmaReal[]>('/classes/all');
        todasTurmas = response.data;
      }

      if (!Array.isArray(todasTurmas)) todasTurmas = [];

      // Filtra de forma tolerante a maiúsculas/minúsculas e formatos de string do SQLite
      const minhasTurmas = todasTurmas.filter((t) => {
        if (!t.studentIds) return false;
        let ids: string[] = [];
        try {
          if (typeof t.studentIds === 'string') {
            const parsed = JSON.parse(t.studentIds);
            ids = Array.isArray(parsed) ? parsed : [t.studentIds];
          } else if (Array.isArray(t.studentIds)) {
            ids = t.studentIds;
          }
        } catch {
          ids = String(t.studentIds).split(',');
        }
        return ids.map(id => String(id).trim().toLowerCase()).includes(String(user.id).trim().toLowerCase());
      });

      const materiasComPresenca = await Promise.all(
        minhasTurmas.map(async (turma) => {
          try {
            const { data: chamadas } = await api.get<any[]>(`/attendance/turma/${turma.id}`);
            const totalAulas = Array.isArray(chamadas) ? chamadas.length : 0;
            
            // 💡 CORREÇÃO 2: Mapeia o array usando 'studentsResult' que salvamos de forma real no SQLite
            const presencas = Array.isArray(chamadas) ? chamadas.filter((c) => {
              try {
                let lista: any[] = [];
                if (typeof c.studentsResult === 'string') {
                  try { lista = JSON.parse(c.studentsResult); } catch { lista = []; }
                } else if (Array.isArray(c.studentsResult)) {
                  lista = c.studentsResult;
                } else if (c.studentsResult && typeof c.studentsResult === 'object') {
                  lista = Object.values(c.studentsResult);
                }

                const registro = lista.find((a: any) => 
                  String(a.id).trim().toLowerCase() === String(user.id).trim().toLowerCase() ||
                  String(a.studentId).trim().toLowerCase() === String(user.id).trim().toLowerCase()
                );

                return registro && (registro.status === 'presente' || registro.presente === true);
              } catch {
                return false;
              }
            }).length : 0;

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