'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import GraficoPresenca from '@/components/GraficoPresenca';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface DashboardStats {
  totalAlunos: number;
  totalTurmas: number;
  mediaPresenca: number;
  baixaFrequencia: {
    alunoId: string;
    presencas: number;
    totalAulas: number;
    porcentagem: number;
  }[];
}

interface ApiClass {
  id: string; name: string; code: string;
  schedule: string; teacherId: string; studentIds: any;
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Controle de estados da Dashboard Administrativa
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Controle de estados do Aluno
  const [materiasAluno, setMateriasAluno] = useState<any[]>([]);
  const [abaAtiva, setAbaAtiva]           = useState<string>('dashboard');

 
  const carregarMetricasDashboard = async () => {
    if (!user || user.role === 'aluno') return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get<DashboardStats>('/attendance/dashboard');
      if (res.data) setStats(res.data);
    } catch (err: any) {
      setStats({ totalAlunos: 0, totalTurmas: 0, mediaPresenca: 0, baixaFrequencia: [] });
      setError("Painel inicializado em modo de espera. Registre chamadas para consolidar os gráficos.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega e filtra as turmas onde o Aluno 
  const carregarDadosAluno = async () => {
    if (!user || user.role !== 'aluno') return;
    setLoading(true);
    try {
      const token = localStorage.getItem('engnet_token') ?? '';
      const allClasses: ApiClass[] = await fetch(`${API}/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      if (Array.isArray(allClasses)) {
        const filtradas = allClasses.filter(turma => {
          let ids: string[] = [];
          if (typeof turma.studentIds === 'string') {
            try { ids = JSON.parse(turma.studentIds); } catch { ids = []; }
          } else if (Array.isArray(turma.studentIds)) {
            ids = turma.studentIds;
          }
          return ids.includes(user.id);
        });

        // Simulação de presença base 
        const formatadas = filtradas.map(t => ({
          turma: t,
          presencas: 0,
          totalAulas: 0,
          pct: 100
        }));
        setMateriasAluno(formatadas);
      }
    } catch (err) {
      console.error("Erro ao processar as turmas do aluno:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'aluno') {
        carregarDadosAluno();
      } else {
        carregarMetricasDashboard();
      }
    }
  }, [user]);

  
  useEffect(() => {
    const escutarMudancaAba = () => {
      const abaSalva = localStorage.getItem('engnet_current_tab') ?? 'dashboard';
      setAbaAtiva(abaSalva);
    };
    
    window.addEventListener('storage', escutarMudancaAba);
    const interval = setInterval(escutarMudancaAba, 400); 
    
    return () => {
      window.removeEventListener('storage', escutarMudancaAba);
      clearInterval(interval);
    };
  }, []);

  // Cálculos matemáticos de apoio do Aluno
  const mediaPresencaAluno = materiasAluno.length
    ? Math.round(materiasAluno.reduce((s, m) => s + m.pct, 0) / materiasAluno.length)
    : 100;
  const emRiscoAluno = materiasAluno.filter(m => m.pct < 75).length;
  const inicialNome = user?.name?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">

         
          {user?.role === 'aluno' && (
            <div className="space-y-6">
              
              {/* Banner de Risco Geral do Aluno */}
              {materiasAluno.some(m => m.pct < 75) && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-bold text-sm text-red-800 dark:text-red-400">Risco de Reprovação detectado</h4>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">Sua frequência em alguma matéria está abaixo de 75%. Compareça às aulas.</p>
                  </div>
                </div>
              )}

              {/* Dashboard do Aluno */}
              {abaAtiva === 'dashboard' && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Olá, {user.name.split(' ')[0]}! </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Acompanhe sua frequência em tempo real.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card titulo="Minhas Matérias" valor={materiasAluno.length} cor="roxo" icone="fa-book" />
                    <Card titulo="Frequência Média" valor={`${mediaPresencaAluno}%`} cor={mediaPresencaAluno >= 75 ? "laranja" : "vermelho"} icone="fa-chart-line" />
                    <Card titulo="Matérias em Risco" valor={emRiscoAluno} cor={emRiscoAluno > 0 ? "vermelho" : "laranja"} icone="fa-exclamation-triangle" />
                  </div>
                </>
              )}

              {/* Minhas Matérias */}
              {abaAtiva === 'minhas materias' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Minhas Disciplinas Matriculadas</h2>
                  {materiasAluno.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border italic text-gray-400">Você não foi matriculado em nenhuma turma até o momento.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {materiasAluno.map(({ turma, pct }) => (
                        <div key={turma.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-extrabold text-lg truncate text-gray-800 dark:text-white">{turma.name}</h3>
                              {pct < 75 && <span className="bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase animate-bounce">Risco</span>}
                            </div>
                            <p className="text-xs font-mono text-orange-500 font-semibold mb-4">{turma.code}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mb-2"><i className="fas fa-clock" /> {turma.schedule || 'Sem cronograma definido'}</p>
                          </div>
                          <div className="border-t pt-4 mt-4 flex justify-between items-center text-xs">
                            <span className="text-gray-400">Sua Frequência:</span>
                            <span className={`font-extrabold ${pct >= 75 ? "text-green-600" : "text-red-500"}`}>{pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Registro de Faltas & Desempenho */}
              {abaAtiva === 'meu desempenho' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Análise Geral de Desempenho</h2>
                  <div className="space-y-3">
                    {materiasAluno.map(({ turma, pct }) => (
                      <div key={turma.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{turma.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{turma.code}</p>
                        </div>
                        <span className={`text-sm font-extrabold ${pct >= 75 ? "text-green-600" : "text-red-500"}`}>{pct}% de Frequência</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/*  Meu Perfil */}
              {abaAtiva === 'meu perfil' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-xl">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Informações do Aluno</h2>
                  <div className="flex items-center gap-4 pb-6 border-b border-dashed">
                    <div className="w-16 h-16 rounded-full bg-[#FF6B00] text-white font-extrabold text-xl flex items-center justify-center border shadow-sm">{inicialNome}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{user.name}</h3>
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mt-0.5">Estudante</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="bg-gray-50 dark:bg-gray-700/40 p-3.5 rounded-xl"><span className="text-gray-400 block mb-0.5">E-mail:</span> <span className="font-semibold text-gray-700 dark:text-gray-200">{user.email}</span></div>
                    <div className="bg-gray-50 dark:bg-gray-700/40 p-3.5 rounded-xl"><span className="text-gray-400 block mb-0.5">Matrícula institucional:</span> <span className="font-mono font-bold text-gray-700 dark:text-gray-200">{user.matricula || '21202343'}</span></div>
                  </div>
                </div>
              )}
            </div>
          )}

          
          {user?.role !== 'aluno' && (
            <>
              {/* Header Administrativo */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {user?.role === 'admin' ? 'Visão geral do sistema' : `Suas turmas, ${user?.name?.split(' ')[0]}`}
                  </p>
                </div>
                <button onClick={carregarMetricasDashboard} className="text-sm px-4 py-2 rounded-lg border font-medium bg-white dark:bg-gray-700">
                  ↻ Atualizar
                </button>
              </div>

              {/* Alertas de Alunos em Risco */}
              {stats && stats.baixaFrequencia.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 p-4 rounded-2xl flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-bounce">🚨</span>
                    <div>
                      <h4 className="font-bold text-sm text-amber-800 dark:text-amber-400">Intervenção de Frequência Necessária</h4>
                      <p className="text-xs text-amber-600 dark:text-gray-400">
                        Existem <span className="font-bold">{stats.baixaFrequencia.length} alunos</span> com frequência ativa abaixo de 75%.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-600 text-white font-extrabold uppercase px-2.5 py-1 rounded-lg">Auditoria Ativa</span>
                </div>
              )}

              {error && (
                <div className="mb-4 bg-orange-50 border p-3 rounded-xl text-xs text-orange-700">
                  <i className="fas fa-info-circle" /> {error}
                </div>
              )}

              {/* Renderização de Cards */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-24 animate-pulse border" />)}
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card titulo="Total de Alunos"     valor={stats.totalAlunos}            cor="laranja" icone="fa-user-graduate" />
                  <Card titulo="Turmas Ativas"       valor={stats.totalTurmas}            cor="roxo"    icone="fa-book-open" />
                  <Card titulo="Média de Presença"  valor={`${stats.mediaPresenca}%`}    cor="laranja" icone="fa-chart-line" />
                  <Card titulo="Baixa Frequência"   valor={stats.baixaFrequencia.length} cor="vermelho" icone="fa-exclamation-triangle" />
                </div>
              ) : null}

              {/* Gráfico Analítico */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl mx-auto mb-6 border">
                <h3 className="text-sm font-bold text-gray-400 uppercase text-center mb-4">Frequência por Disciplina</h3>
                <GraficoPresenca />
              </div>

              {/* Listagem de Alunos em Alerta */}
              {stats && stats.baixaFrequencia.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl mx-auto border">
                  <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <i className="fas fa-user-slash" /> Alunos com frequência crítica
                  </h3>
                  <div className="space-y-2">
                    {stats.baixaFrequencia.map(a => (
                      <div key={a.alunoId} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">{a.porcentagem}%</div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Matrícula ID: {a.alunoId.slice(0, 8)}…</p>
                            <p className="text-xs text-gray-500">{a.presencas}/{a.totalAulas} presenças</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-800">Crítico</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}