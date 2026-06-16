"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

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
  id: string; name: string; code: string; studentIds: string[];
}
interface ApiUser { id: string; name: string; matricula?: string; fotoUrl?: string; }
interface ApiAttendance { id: string; classId: string; date: string; presentStudents: string; }

export default function ChamadaPage() {
  const [turmas, setTurmas]         = useState<ApiClass[]>([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [dataAula, setDataAula]       = useState('2026-06-16'); 
  const [alunos, setAlunos]           = useState<ApiUser[]>([]);
  const [loading, setLoading]         = useState(false);
  const [erro, setErro]               = useState('');
  const [sucesso, setSucesso]         = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [presencas, setPresencas]     = useState<Record<string, 'presente' | 'falta'>>({});
  const [isModalListaAberto, setIsModalListaAberto] = useState(false);
  const [historicoChamadas, setHistoricoChamadas] = useState<ApiAttendance[]>([]);

  useEffect(() => {
    const user = getSavedUser();
    if (!user) return;
    const headers = { Authorization: `Bearer ${getToken()}` };
    
  
    const url = user.role === 'admin' ? `${API}/classes` : `${API}/classes/teacher/${user.id}`;

    fetch(url, { headers })
      .then(r => r.json())
      .then((cls: ApiClass[]) => setTurmas(Array.isArray(cls) ? cls : []))
      .catch(() => setErro('Erro ao carregar disciplinas.'));
  }, []);

  const carregarHistóricoDeDatas = (classId: string) => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    fetch(`${API}/attendance/turma/${classId}`, { headers })
      .then(r => r.json())
      .then((data) => setHistoricoChamadas(Array.isArray(data) ? data : []))
      .catch(() => console.log("Erro ao processar histórico de datas"));
  };

  useEffect(() => {
    if (!selectedTurma) {
      setAlunos([]);
      setHistoricoChamadas([]);
      return;
    }
    setLoading(true);
    setErro('');
    setCurrentIndex(0);
    setPresencas({});

    carregarHistóricoDeDatas(selectedTurma);

    const turmaAlvo = turmas.find(t => t.id === selectedTurma);
    if (!turmaAlvo || !turmaAlvo.studentIds?.length) {
      setAlunos([]);
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${getToken()}` };
    fetch(`${API}/users/by-ids?ids=${turmaAlvo.studentIds.join(',')}`, { headers })
      .then(r => r.json())
      .then((students: ApiUser[]) => {
        setAlunos(Array.isArray(students) ? students : []);
        setLoading(false);
      })
      .catch(() => {
        setErro('Erro ao carregar estudantes da turma.');
        setLoading(false);
      });
  }, [selectedTurma, turmas]);

  const totalPresentes = Object.values(presencas).filter(v => v === 'presente').length;
  const totalFaltas = Object.values(presencas).filter(v => v === 'falta').length;

  const registrarVoto = (status: 'presente' | 'falta') => {
    if (!alunos.length || currentIndex >= alunos.length) return;
    
    const alunoAtual = alunos[currentIndex];
    setPresencas(prev => ({ ...prev, [alunoAtual.id]: status }));

    if (currentIndex < alunos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsModalListaAberto(true);
    }
  };

  const alternarStatusNaLista = (alunoId: string, novoStatus: 'presente' | 'falta') => {
    setPresencas(prev => ({ ...prev, [alunoId]: novoStatus }));
  };

  const saltarParaAluno = (index: number) => {
    setCurrentIndex(index);
    setIsModalListaAberto(false);
  };

  const handleSalvarChamada = async () => {
    if (!selectedTurma) return setErro('Selecione uma turma antes de salvar.');
    setErro('');
    setSucesso('');

    const headers = { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' };
    const payload = {
      classId: selectedTurma,
      date: dataAula,
      records: Object.entries(presencas).map(([studentId, status]) => ({
        studentId,
        isPresent: status === 'presente'
      }))
    };

    try {
      const res = await fetch(`${API}/attendance`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setSucesso('Chamada consolidada e salva com sucesso!');
      setIsModalListaAberto(false);
      carregarHistóricoDeDatas(selectedTurma);
    } catch {
      setErro('Falha ao enviar a lista de presença para o servidor.');
    }
  };

  const alunoAtual = alunos[currentIndex];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
          
          {/* Seleção da Disciplina */}
          <div>
            <select
              value={selectedTurma}
              onChange={e => setSelectedTurma(e.target.value)}
              className="w-full md:w-72 px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 font-medium bg-white"
            >
              <option value="">Selecione uma matéria...</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
              ))}
            </select>
          </div>

          {/* BARRA DE FILTROS */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Data da Aula</span>
              <input
                type="date"
                value={dataAula}
                onChange={e => setDataAula(e.target.value)}
                className="px-4 py-1.5 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white text-sm outline-none w-full md:w-auto font-medium"
              />
            </div>
            
            <div className="flex gap-4 text-sm font-bold">
              <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                ✓ {totalPresentes} presentes
              </span>
              <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                ✕ {totalFaltas} faltas
              </span>
            </div>
          </div>

          {erro && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>}
          {sucesso && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{sucesso}</div>}

          {selectedTurma && !loading && alunos.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-xl mx-auto">
                <div className="flex justify-center pt-6">
                  <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                    Aluno {Math.min(currentIndex + 1, alunos.length)} de {alunos.length}
                  </span>
                </div>

                <div className="p-8 text-center space-y-4">
                  <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-md bg-gray-50 flex items-center justify-center">
                    {alunoAtual?.fotoUrl ? (
                      <img src={alunoAtual.fotoUrl} alt={alunoAtual.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-user text-5xl text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {alunoAtual ? alunoAtual.name : "Todos respondidos!"}
                    </h3>
                    <p className="text-sm font-semibold text-gray-400 mt-1">
                      {alunoAtual?.matricula ? `Matrícula: ${alunoAtual.matricula}` : "Abra a lista para salvar"}
                    </p>
                  </div>
                </div>

                {alunoAtual && (
                  <div className="flex border-t border-gray-200 h-20">
                    <button onClick={() => registrarVoto('falta')} className="flex-1 flex items-center justify-center gap-3 bg-white text-red-600 font-bold text-lg hover:bg-red-50">
                      ✕ Falta
                    </button>
                    <button onClick={() => registrarVoto('presente')} className="flex-1 flex items-center justify-center gap-3 bg-white text-green-600 font-bold text-lg hover:bg-green-50">
                      ✓ Presente
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center max-w-xl mx-auto">
                <button onClick={() => setIsModalListaAberto(true)} className="px-4 py-2.5 text-xs font-bold border rounded-xl flex items-center gap-2 bg-white text-gray-600">
                  <i className="fas fa-list-ol text-purple-500" /> Editar / Ver Lista
                </button>
                <button onClick={handleSalvarChamada} className="bg-[#FF8C00] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
                  <i className="fas fa-save" /> Salvar Chamada
                </button>
              </div>
            </div>
          )}

          {/* HISTÓRICO DE DATAS */}
          {selectedTurma && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-orange-500" /> Histórico de Chamadas Desta Disciplina
              </h4>
              {historicoChamadas.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">Nenhuma aula registrada anteriormente.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {historicoChamadas.map((c) => {
                    let qtdPresentes = 0;
                    try { qtdPresentes = JSON.parse(c.presentStudents).length; } catch { qtdPresentes = 0; }
                    const dataFormatada = c.date.split('-').reverse().join('/');
                    return (
                      <div key={c.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center border">
                        <div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{dataFormatada}</p>
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-lg">
                          {qtdPresentes} Presentes
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {isModalListaAberto && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-bold">Conferência de Presença</h3>
                  <button onClick={() => setIsModalListaAberto(false)} className="text-gray-400 text-xl"><i className="fas fa-times" /></button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-2">
                  {alunos.map((aluno, idx) => {
                    const status = presencas[aluno.id];
                    return (
                      <div key={aluno.id} className="flex items-center justify-between p-3 rounded-xl border bg-white">
                        <div onClick={() => saltarParaAluno(idx)} className="flex items-center gap-3 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center">{idx + 1}</div>
                          <p className="text-sm font-bold">{aluno.name}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => alternarStatusNaLista(aluno.id, 'falta')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${status === 'falta' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400'}`}>✕ Falta</button>
                          <button onClick={() => alternarStatusNaLista(aluno.id, 'presente')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${status === 'presente' ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-400'}`}>✓ Presente</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                  <button onClick={() => setIsModalListaAberto(false)} className="px-4 py-2 border text-xs rounded-xl">Voltar ao Painel</button>
                  <button onClick={handleSalvarChamada} className="bg-[#FF8C00] text-white px-4 py-2 rounded-xl font-bold text-xs">Finalizar e Salvar</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}