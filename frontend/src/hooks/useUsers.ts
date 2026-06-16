import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
  matricula?: string;
}

export function useUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
      alert('Não foi possível carregar a lista de usuários.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const criarUsuario = async (dados: any) => {
    try {
      
      await api.post('/auth/register', dados);
      fetchUsuarios();
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário', error);
      alert('Erro ao criar usuário. Verifique os dados.');
      return false;
    }
  };

  const deletarUsuario = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      alert('Erro ao deletar usuário.');
      return false;
    }
  };

  return { usuarios, isLoading, fetchUsuarios, criarUsuario, deletarUsuario };
}