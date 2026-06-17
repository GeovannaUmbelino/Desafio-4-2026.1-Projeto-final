import { useState, useCallback } from 'react';
import api from '@/lib/api';


export interface TurmaReal {
  id: string;
  name: string;
  code: string;
  schedule: string;
  teacherId: string;
  studentIds?: string[];
  totalStudents?: number;
}

export function useClasses() {
  const [turmas, setTurmas] = useState<TurmaReal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Busca todas as turmas 
  const fetchTurmas = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/classes');
      setTurmas(data);
    } catch (error) {
      console.error('Erro ao buscar turmas', error);
      alert('Não foi possível carregar as turmas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cria uma nova turma
  const criarTurma = async (dados: { name: string; code: string; schedule: string; teacherId: string }) => {
    try {
      const { data } = await api.post('/classes', dados);
      
      setTurmas((prev) => [...prev, data]);
      return true;
    } catch (error) {
      console.error('Erro ao criar turma', error);
      alert('Erro ao criar a turma. Verifique os dados.');
      return false;
    }
  };

  //Atualiza uma turma existente
  const editarTurma = async (id: string, dados: { name: string; code: string; schedule: string }) => {
    try {
      const { data } = await api.patch(`/classes/${id}`, dados);
      setTurmas((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
      return true;
    } catch (error) {
      console.error('Erro ao editar turma', error);
      alert('Erro ao editar a turma.');
      return false;
    }
  };

  //Remove a turma
  const deletarTurma = async (id: string) => {
    try {
      await api.delete(`/classes/${id}`);
      setTurmas((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar turma', error);
      alert('Erro ao deletar a turma.');
      return false;
    }
  };

  return { turmas, isLoading, fetchTurmas, criarTurma, editarTurma, deletarTurma };
}