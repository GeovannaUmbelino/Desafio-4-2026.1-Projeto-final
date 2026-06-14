export interface Turma {
  id: number;
  nome: string;
  codigo: string;
  horario: string;
  total: number;
}

export interface Aluno {
  id: number;
  nome: string;
  turmaId: number;
  presencas: number;
  totalAulas: number;
}