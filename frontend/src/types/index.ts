// BUG CORRIGIDO #4: Tipos alinhados com as entidades do backend (NestJS/TypeORM)
// O backend retorna UUIDs (string), não números inteiros.
// Os campos seguem o padrão inglês do backend (name, code, teacherId).

export interface Turma {
  id: string;          // UUID gerado pelo TypeORM
  name: string;        // era "nome" — agora alinhado com Class.name do backend
  code: string;        // era "codigo" — alinhado com Class.code
  teacherId: string;   // UUID do professor responsável
  studentIds: string[]; // Array de UUIDs dos alunos matriculados
  schedule: string;    // era "horario" — alinhado com Class.schedule
  createdAt?: string;
}

export interface Aluno {
  id: string;          // UUID gerado pelo TypeORM
  name: string;        // era "nome"
  email: string;
  role: 'professor' | 'aluno';
  // Campos calculados localmente a partir dos registros de Attendance:
  presencas?: number;
  totalAulas?: number;
}

export interface Chamada {
  id: string;
  classId: string;
  date: string;           // Formato "YYYY-MM-DD"
  presentStudents: string; // JSON string de UUID[] — parse necessário
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

// Tipo de criação de usuário (alinhado com CreateUserDto do backend)
export interface CriarUsuarioPayload {
  name: string;
  email: string;
  password: string;
  role: 'professor' | 'aluno';
}

// Tipo de criação de turma (alinhado com CreateClassDto do backend)
export interface CriarTurmaPayload {
  name: string;
  code: string;
  teacherId: string;
  schedule: string;
}

// Tipo de registro de chamada (alinhado com CreateAttendanceDto do backend)
export interface RegistrarChamadaPayload {
  classId: string;
  date: string;           // "YYYY-MM-DD"
  presentStudents: string[]; // Array de UUIDs
}