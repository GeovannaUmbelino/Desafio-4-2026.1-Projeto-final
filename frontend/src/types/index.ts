export interface Turma {
  id: string;         
  name: string;        
  code: string;        
  teacherId: string;   
  studentIds: string[]; 
  schedule: string;    
  createdAt?: string;
}

export interface Aluno {
  id: string;          
  name: string;        
  email: string;
  role: 'professor' | 'aluno';
  presencas?: number;
  totalAulas?: number;
}

export interface Chamada {
  id: string;
  classId: string;
  date: string;           
  presentStudents: string; 
  createdAt?: string;
  class?: Turma;
}

export interface RelatorioChamada {
  classId: string;
  totalAulas: number;
  mediaFrequenciaTurma: string;  // ex: "82%"
  relatorioAlunos: RelatorioAluno[];
}

export interface RelatorioAluno {
  alunoId: string;
  presencas: number;
  faltas: number;
  porcentagemFrequencia: number;
  status: 'Regular' | 'Risco de Reprovação';
}

// Tipo de criação de usuário 
export interface CriarUsuarioPayload {
  name: string;
  email: string;
  password: string;
  role: 'professor' | 'aluno';
}

export interface CriarTurmaPayload {
  name: string;
  code: string;
  teacherId: string;
  schedule: string;
}

export interface RegistrarChamadaPayload {
  classId: string;
  date: string;          
  presentStudents: string[]; 
}