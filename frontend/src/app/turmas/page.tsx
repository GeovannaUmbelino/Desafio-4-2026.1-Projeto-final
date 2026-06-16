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
interface ApiUser { id: string; name: string; matricula?: string; }

export default function TurmasPage() {
  const [turmas, setTurmas]         = useState<ApiClass[]>([]);
  const [alunosMap, setAlunosMap]   = useState<Record<string, ApiUser[]>>({});
  const [expandida, setExpandida]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [erro, setErro]             = useState('');

  useEffect(() => {
    const user = getSavedUser();
    if (!user) return;

    const headers = { Authorization: `Bearer ${getToken()}` };

    fetch(`${API}/classes/teacher/${user.id}`, { headers })
      .then(r => r.json())
      .then((cls: ApiClass[]) => {
        setTurmas(cls);
        setLoading(false);
      })
      .catch(() => { setErro('Erro ao carregar turmas'); setLoading(false); });
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Minhas Turmas</h2>
          </div>

          {loading && (
            <div className="text-center py-16 text-gray-400">
              <i className="fas fa-spinner fa-spin text-3xl mb-3 block" />
              Carregando turmas...
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              <i className="fas fa-exclamation-triangle mr-2" />{erro}
            </div>
          )}

          {!loading && turmas.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <i className="fas fa-folder-open text-5xl text-gray-400 mb-3 block" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma turma cadastrada</p>
              <p className="text-xs text-gray-400 mt-1">Contate o administrador para criar turmas</p>
            </div>
          )}

          {/* Cards de turmas  */}
          {!loading && turmas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.map((turma) => {
                const alunos = alunosMap[turma.id] ?? [];
                const isExp  = expandida === turma.id;
                return (
                  <div key={turma.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{turma.name}</h3>
                        <p className="text-sm text-gray-500">Código: {turma.code}</p>
                      </div>
                      {/* Professor não edita/exclui — só admin pode */}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      <i className="fas fa-clock mr-2" />{turma.schedule || '—'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      <i className="fas fa-users mr-2" />{turma.studentIds?.length ?? 0} alunos
                    </p>

                    <button
                      onClick={() => verAlunos(turma)}
                      className="w-full bg-laranja text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition-all"
                    >
                      {isExp ? 'Fechar' : 'Ver alunos'}
                    </button>

                    {/* Lista de alunos expandida */}
                    {isExp && (
                      <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                        {!turma.studentIds?.length ? (
                          <p className="text-xs text-gray-400 text-center py-2">Nenhum aluno matriculado</p>
                        ) : alunos.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-2">
                            <i className="fas fa-spinner fa-spin mr-1" /> Carregando...
                          </p>
                        ) : (
                          <ul className="space-y-1 max-h-40 overflow-y-auto">
                            {alunos.map(a => (
                              <li key={a.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-6 h-6 rounded-full bg-laranja/10 flex items-center justify-center text-laranja text-xs font-bold flex-shrink-0">
                                  {a.name.charAt(0)}
                                </div>
                                <span className="truncate">{a.name}</span>
                                {a.matricula && <span className="text-xs text-gray-400 ml-auto">{a.matricula}</span>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
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
