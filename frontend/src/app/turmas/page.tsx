"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('engnet_token') ?? '';
}
function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('engnet_user') ?? 'null'); }
  catch { return null; }
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiClass {
  id: string; name: string; code: string;
  schedule: string; teacherId: string; studentIds: string[];
}
interface ApiUser { id: string; name: string; role?: string; matricula?: string; }

export default function TurmasPage() {
  const [turmas, setTurmas]         = useState<ApiClass[]>([]);
  const [professores, setProfessores] = useState<ApiUser[]>([]); 
  const [todosAlunos, setTodosAlunos] = useState<ApiUser[]>([]); 
  const [alunosMap, setAlunosMap]   = useState<Record<string, ApiUser[]>>({});
  const [expandida, setExpandida]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [erro, setErro]             = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [isModalAberto, setIsModalAberto] = useState(false);
  const [novoNome, setNovoNome]           = useState('');
  const [novoCodigo, setNovoCodigo]       = useState('');
  const [novoHorario, setNovoHorario]     = useState('');
  const [idProfessor, setIdProfessor]     = useState('');

  const [alunoParaMatricular, setAlunoParaMatricular] = useState<Record<string, string>>({});

  const carregarDadosIniciais = () => {
    const user = getSavedUser();
    if (!user) return;
    setCurrentUser(user);

    const headers = { Authorization: `Bearer ${getToken()}` };
    
    const urlBusca = user.role === 'admin' 
      ? `${API}/classes` 
      : `${API}/classes/teacher/${user.id}`;

    fetch(urlBusca, { headers })
      .then(r => r.json())
      .then((cls: ApiClass[]) => {
        setTurmas(Array.isArray(cls) ? cls : []);
        setLoading(false);
      })
      .catch(() => { setErro('Erro ao carregar turmas'); setLoading(false); });

    if (user.role === 'admin') {
      fetch(`${API}/users`, { headers })
        .then(r => r.json())
        .then((usuarios: ApiUser[]) => {
          if (Array.isArray(usuarios)) {
            setProfessores(usuarios.filter(u => u.role === 'professor'));
            setTodosAlunos(usuarios.filter(u => u.role === 'aluno')); 
          }
        })
        .catch(() => console.log('Erro ao buscar listas do sistema'));
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const verAlunos = async (turma: ApiClass) => {
    if (expandida === turma.id) { setExpandida(null); return; }
    setExpandida(turma.id);

    if (alunosMap[turma.id] || !turma.studentIds?.length) return;

    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const students: ApiUser[] = await fetch(
        `${API}/users/by-ids?ids=${turma.studentIds.join(',')}`, { headers }
      ).then(r => r.json());
      setAlunosMap(prev => ({ ...prev, [turma.id]: students }));
    } catch {
      setAlunosMap(prev => ({ ...prev, [turma.id]: [] }));
    }
  };

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!idProfessor) return setErro('Selecione um professor responsável.');

    const headers = { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
    try {
      const novaTurma = await fetch(`${API}/classes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: novoNome, code: novoCodigo, schedule: novoHorario, teacherId: idProfessor })
      }).then(r => { if (!r.ok) throw new Error(); return r.json(); });

      setTurmas(prev => [...prev, novaTurma]);
      setIsModalAberto(false);
      setNovoNome(''); setNovoCodigo(''); setNovoHorario(''); setIdProfessor('');
    } catch {
      setErro('Erro ao criar a turma no servidor.');
    }
  };

  const handleMatricularAluno = async (turmaId: string) => {
    setErro('');
    const studentId = alunoParaMatricular[turmaId];
    if (!studentId) return;

    const headers = { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };

    try {
      const turmaAtualizada: ApiClass = await fetch(`${API}/classes/${turmaId}/add-student`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ studentId })
      }).then(r => { if (!r.ok) throw new Error(); return r.json(); });

      setTurmas(prev => prev.map(t => t.id === turmaId ? turmaAtualizada : t));

      const alunoAdicionado = todosAlunos.find(a => a.id === studentId);
      if (alunoAdicionado) {
        setAlunosMap(prev => ({
          ...prev,
          [turmaId]: [...(prev[turmaId] ?? []), alunoAdicionado]
        }));
      }

      setAlunoParaMatricular(prev => ({ ...prev, [turmaId]: '' }));
    } catch {
      setErro('Não foi possível matricular o aluno. Verifique as rotas do servidor.');
    }
  };

  const handleDeletarTurma = async (id: string) => {
    if (!confirm('Deseja realmente remover esta turma definitivamente?')) return;
    setErro('');
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const res = await fetch(`${API}/classes/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      setTurmas(prev => prev.filter(t => t.id !== id));
    } catch {
      setErro('Não foi possível deletar a turma selecionada.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {currentUser?.role === 'admin' ? 'Gerenciamento Global de Turmas' : 'Minhas Turmas'}
            </h2>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setIsModalAberto(true)}
                className="bg-[#FF8C00] hover:bg-[#e67e00] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all text-sm flex items-center gap-2"
              >
                <i className="fas fa-plus" /> Criar Nova Turma
              </button>
            )}
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
              <i className="fas fa-exclamation-triangle" /> {erro}
            </div>
          )}

          {/* Modal Criar Turma */}
          {isModalAberto && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nova Turma</h3>
                <form onSubmit={handleCriarTurma} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Disciplina</label>
                    <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Cálculo 1" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código da Turma</label>
                    <input type="text" value={novoCodigo} onChange={e => setNovoCodigo(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: MAT0025" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Horário / Cronograma</label>
                    <input type="text" value={novoHorario} onChange={e => setNovoHorario(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Quinta-feira 19:00 às 22:30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professor Responsável</label>
                    <select value={idProfessor} onChange={e => setIdProfessor(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="">Selecione o professor...</option>
                      {professores.map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.matricula ? `(${p.matricula})` : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalAberto(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white py-2.5 rounded-xl font-semibold text-sm transition-all">Cancelar</button>
                    <button type="submit" className="flex-1 bg-[#FF8C00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">Salvar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading && <div className="text-center py-16 text-gray-400"><i className="fas fa-spinner fa-spin text-3xl mb-3 block" />Carregando dados...</div>}

          {!loading && turmas.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md border">
              <i className="fas fa-folder-open text-5xl text-gray-300 mb-3 block" />
              <p className="text-gray-400">Nenhuma turma registrada globalmente</p>
            </div>
          )}

          {/* Grid de Cards Totalmente Estilizado (Sem Quebras) */}
          {!loading && turmas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.map((turma) => {
                const alunos = alunosMap[turma.id] ?? [];
                const isExp  = expandida === turma.id;
                
                const alunosFiltradosParaMatricula = todosAlunos.filter(
                  aluno => !turma.studentIds?.includes(aluno.id)
                );

                return (
                  <div key={turma.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/30 dark:shadow-none flex flex-col justify-between transition-all hover:shadow-2xl">
                    
                    {/* Cabeçalho do Card */}
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="overflow-hidden flex-1">
                          <h3 className="font-extrabold text-xl text-gray-800 dark:text-white truncate">{turma.name}</h3>
                          <p className="text-xs text-orange-500 font-mono font-semibold mt-0.5">Código: {turma.code}</p>
                        </div>
                        {currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => handleDeletarTurma(turma.id)} 
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-2xs"
                            title="Excluir Turma"
                          >
                            <i className="fas fa-trash-alt text-sm" />
                          </button>
                        )}
                      </div>

                      {/* Metadados */}
                      <div className="space-y-2.5 mb-5 bg-gray-50 dark:bg-gray-700/30 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                          <i className="fas fa-clock text-orange-500 text-sm" /> 
                          <span className="font-medium">{turma.schedule || 'Sem horário definido'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                          <i className="fas fa-users text-purple-500 text-sm" /> 
                          <span className="font-bold">{turma.studentIds?.length ?? 0} alunos matriculados</span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação Dinâmicos */}
                    <div className="space-y-4">
                      <button 
                        onClick={() => verAlunos(turma)} 
                        className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-2xs ${
                          isExp ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200" : "bg-[#FF6B00] text-white hover:bg-orange-600"
                        }`}
                      >
                        {isExp ? 'Fechar Lista' : 'Gerenciar Alunos'}
                      </button>

                      {isExp && (
                        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                          
                          {/* Matrícula (Apenas Admin) */}
                          {currentUser?.role === 'admin' && (
                            <div>
                              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Matricular Novo Aluno</label>
                              <div className="flex items-center gap-2 w-full">
                                <select
                                  value={alunoParaMatricular[turma.id] ?? ''}
                                  onChange={e => setAlunoParaMatricular(prev => ({ ...prev, [turma.id]: e.target.value }))}
                                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none text-xs bg-white font-medium shadow-2xs"
                                >
                                  <option value="">Selecione...</option>
                                  {alunosFiltradosParaMatricula.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} {a.matricula ? `(${a.matricula})` : ''}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleMatricularAluno(turma.id)}
                                  disabled={!alunoParaMatricular[turma.id]}
                                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-lg transition-all shadow-sm disabled:opacity-40 flex-shrink-0 active:scale-95"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Listagem Interna de Alunos Matriculados */}
                          <div className="bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-2xl border">
                            {!turma.studentIds?.length ? (
                              <p className="text-xs text-gray-400 text-center py-2 italic">Nenhum aluno matriculado nesta turma</p>
                            ) : alunos.length === 0 ? (
                              <p className="text-xs text-gray-400 text-center py-2"><i className="fas fa-spinner fa-spin mr-1" /> Buscando chamadas...</p>
                            ) : (
                              <ul className="space-y-2 max-h-36 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-gray-700">
                                {alunos.map(a => (
                                  <li key={a.id} className="flex items-center gap-2 text-xs py-2 first:pt-0 last:pb-0">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                      {a.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate font-semibold text-gray-700 dark:text-gray-200">{a.name}</span>
                                    {a.matricula && <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded ml-auto">{a.matricula}</span>}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}