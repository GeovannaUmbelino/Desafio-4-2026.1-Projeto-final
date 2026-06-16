import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { TurmaReal } from './useClasses';

export interface AlunoRelatorio {
  id: string;
  nome: string;
  turmaId: string;
  presencas: number;
  totalAulas: number;
}

export function useReports() {
  const [turmas, setTurmas] = useState<TurmaReal[]>([]);
  const [alunos, setAlunos] = useState<AlunoRelatorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDadosDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
    
      const { data: turmasData } = await api.get('/classes');
      setTurmas(turmasData);

      
      const { data: usersData } = await api.get('/users');
      
      
      const alunosMapeados: AlunoRelatorio[] = usersData
        .filter((u: any) => u.role === 'aluno')
        .map((u: any, index: number) => ({
          id: u.id,
          nome: u.name,
          turmaId: turmasData[index % turmasData.length]?.id || '', 
          presencas: Math.floor(Math.random() * 20) + 80, 
          totalAulas: 100,
        }));

      setAlunos(alunosMapeados);
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDadosDashboard();
  }, [fetchDadosDashboard]);

  return { turmas, alunos, isLoading };
}