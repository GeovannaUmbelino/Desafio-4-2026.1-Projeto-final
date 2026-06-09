"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Turma, Aluno } from '@/types';

interface DataContextType {
  turmas: Turma[];
  alunos: Aluno[];
  adicionarTurma: (turma: Turma) => void;
  editarTurma: (turma: Turma) => void;
  deletarTurma: (id: number) => void;
  atualizarPresenca: (alunoId: number, presente: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const turmasSalvas = localStorage.getItem('turmas');
    const alunosSalvos = localStorage.getItem('alunos');
    
    if (turmasSalvas && alunosSalvos) {
      setTurmas(JSON.parse(turmasSalvas));
      setAlunos(JSON.parse(alunosSalvos));
    } else {
      // Dados de exemplo
      const turmasExemplo: Turma[] = [
        { id: 1, nome: "Cálculo I", codigo: "MAT0025", horario: "14:00 - 16:00", total: 25 },
        { id: 2, nome: "Sistemas Digitais", codigo: "ENE0039", horario: "16:00 - 18:00", total: 20 },
        { id: 3, nome: "Instalações elétricas", codigo: "ENE0071", horario: "08:00 - 10:00", total: 30 }
      ];
      
      const alunosExemplo: Aluno[] = [
        { id: 1, nome: "João Silva", turmaId: 1, presencas: 8, totalAulas: 10 },
        { id: 2, nome: "Maria Santos", turmaId: 1, presencas: 9, totalAulas: 10 },
        { id: 3, nome: "Pedro Oliveira", turmaId: 1, presencas: 5, totalAulas: 10 },
        { id: 4, nome: "Ana Costa", turmaId: 2, presencas: 7, totalAulas: 8 },
        { id: 5, nome: "Lucas Ferreira", turmaId: 2, presencas: 8, totalAulas: 8 },
        { id: 6, nome: "Carla Mendes", turmaId: 3, presencas: 6, totalAulas: 8 }
      ];
      
      setTurmas(turmasExemplo);
      setAlunos(alunosExemplo);
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (turmas.length > 0) {
      localStorage.setItem('turmas', JSON.stringify(turmas));
    }
  }, [turmas]);

  useEffect(() => {
    if (alunos.length > 0) {
      localStorage.setItem('alunos', JSON.stringify(alunos));
    }
  }, [alunos]);

  const adicionarTurma = (turma: Turma) => {
    setTurmas([...turmas, turma]);
    // Adicionar alunos exemplo
    const novosAlunos: Aluno[] = [];
    for (let i = 1; i <= 3; i++) {
      novosAlunos.push({
        id: Date.now() + i,
        nome: `Aluno Exemplo ${i}`,
        turmaId: turma.id,
        presencas: Math.floor(Math.random() * 5) + 3,
        totalAulas: 8
      });
    }
    setAlunos([...alunos, ...novosAlunos]);
  };

  const editarTurma = (turmaEditada: Turma) => {
    setTurmas(turmas.map(t => t.id === turmaEditada.id ? turmaEditada : t));
  };

  const deletarTurma = (id: number) => {
    setTurmas(turmas.filter(t => t.id !== id));
    setAlunos(alunos.filter(a => a.turmaId !== id));
  };

  const atualizarPresenca = (alunoId: number, presente: boolean) => {
    setAlunos(alunos.map(aluno => {
      if (aluno.id === alunoId && presente && aluno.presencas < aluno.totalAulas) {
        return { ...aluno, presencas: aluno.presencas + 1 };
      }
      return aluno;
    }));
  };

  return (
    <DataContext.Provider value={{
      turmas,
      alunos,
      adicionarTurma,
      editarTurma,
      deletarTurma,
      atualizarPresenca
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}