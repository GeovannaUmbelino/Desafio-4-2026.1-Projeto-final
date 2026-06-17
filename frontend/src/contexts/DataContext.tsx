"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Turma,
  Aluno,
  Chamada,
  RelatorioChamada,
  CriarTurmaPayload,
  CriarUsuarioPayload,
  RegistrarChamadaPayload,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${error}`);
  }
  return res.json() as Promise<T>;
}


interface DataContextType {
  // Estado
  turmas: Turma[];
  alunos: Aluno[];
  loading: boolean;
  error: string | null;

  // Usuários
  criarUsuario: (payload: CriarUsuarioPayload) => Promise<Aluno>;
  buscarUsuario: (id: string) => Promise<Aluno>;

  // Turmas
  carregarTurmasDoProfessor: (teacherId: string) => Promise<void>;
  carregarTurmasDoAluno: (studentId: string) => Promise<void>;
  criarTurma: (payload: CriarTurmaPayload) => Promise<Turma>;
  editarTurma: (id: string, payload: Partial<CriarTurmaPayload>) => Promise<Turma>;
  deletarTurma: (id: string) => Promise<void>;
  matricularAluno: (classId: string, studentId: string) => Promise<Turma>;
  dashboardTurma: (id: string) => Promise<Turma & { totalStudents: number }>;

  // Chamadas / Presença
  registrarChamada: (payload: RegistrarChamadaPayload) => Promise<Chamada>;
  buscarChamadasDaTurma: (classId: string, startDate?: string, endDate?: string) => Promise<Chamada[]>;
  buscarRelatorio: (classId: string) => Promise<RelatorioChamada>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);


export function DataProvider({ children }: { children: ReactNode }) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Usuários 
  const criarUsuario = useCallback(
    (payload: CriarUsuarioPayload) =>
      withLoading(() => apiFetch<Aluno>('/users', { method: 'POST', body: JSON.stringify(payload) })),
    [withLoading],
  );

  const buscarUsuario = useCallback(
    (id: string) =>
      withLoading(async () => {
        const user = await apiFetch<Aluno>(`/users/${id}`);
        return user;
      }),
    [withLoading],
  );

  //  Turmas 
  const carregarTurmasDoProfessor = useCallback(
    (teacherId: string) =>
      withLoading(async () => {
        const data = await apiFetch<Turma[]>(`/classes/teacher/${teacherId}`);
        setTurmas(data);
      }),
    [withLoading],
  );

  const carregarTurmasDoAluno = useCallback(
    (studentId: string) =>
      withLoading(async () => {
        const data = await apiFetch<Turma[]>(`/classes/student/${studentId}`);
        setTurmas(data);
      }),
    [withLoading],
  );

  const criarTurma = useCallback(
    (payload: CriarTurmaPayload) =>
      withLoading(async () => {
        const nova = await apiFetch<Turma>('/classes', { method: 'POST', body: JSON.stringify(payload) });
        setTurmas((prev) => [...prev, nova]);
        return nova;
      }),
    [withLoading],
  );

  const editarTurma = useCallback(
    (id: string, payload: Partial<CriarTurmaPayload>) =>
      withLoading(async () => {
        const atualizada = await apiFetch<Turma>(`/classes/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setTurmas((prev) => prev.map((t) => (t.id === id ? atualizada : t)));
        return atualizada;
      }),
    [withLoading],
  );

  const deletarTurma = useCallback(
    (id: string) =>
      withLoading(async () => {
        await apiFetch<void>(`/classes/${id}`, { method: 'DELETE' });
        setTurmas((prev) => prev.filter((t) => t.id !== id));
      }),
    [withLoading],
  );

  const matricularAluno = useCallback(
    (classId: string, studentId: string) =>
      withLoading(() =>
        apiFetch<Turma>(`/classes/${classId}/enroll`, {
          method: 'PATCH',
          body: JSON.stringify({ studentId }),
        }),
      ),
    [withLoading],
  );

  const dashboardTurma = useCallback(
    (id: string) =>
      withLoading(() =>
        apiFetch<Turma & { totalStudents: number }>(`/classes/${id}/dashboard`),
      ),
    [withLoading],
  );

  // ── Chamadas / Presença ───────────────────
  const registrarChamada = useCallback(
    (payload: RegistrarChamadaPayload) =>
      withLoading(() =>
        apiFetch<Chamada>('/attendance', { method: 'POST', body: JSON.stringify(payload) }),
      ),
    [withLoading],
  );

  const buscarChamadasDaTurma = useCallback(
    (classId: string, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const query = params.toString() ? `?${params.toString()}` : '';
      return withLoading(() =>
        apiFetch<Chamada[]>(`/attendance/turma/${classId}${query}`),
      );
    },
    [withLoading],
  );

  const buscarRelatorio = useCallback(
    (classId: string) =>
      withLoading(() => apiFetch<RelatorioChamada>(`/attendance/turma/${classId}/report`)),
    [withLoading],
  );

  return (
    <DataContext.Provider
      value={{
        turmas,
        alunos,
        loading,
        error,
        criarUsuario,
        buscarUsuario,
        carregarTurmasDoProfessor,
        carregarTurmasDoAluno,
        criarTurma,
        editarTurma,
        deletarTurma,
        matricularAluno,
        dashboardTurma,
        registrarChamada,
        buscarChamadasDaTurma,
        buscarRelatorio,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}
