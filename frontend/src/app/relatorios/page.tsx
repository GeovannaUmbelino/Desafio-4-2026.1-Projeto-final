"use client";
// frontend/src/app/relatorios/page.tsx
// Dados reais do backend. Visual idêntico ao original + gráficos por turma.

import { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";

function getToken() { return localStorage.getItem('engnet_token') ?? ''; }
function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('engnet_user') ?? 'null'); }
  catch { return null; }
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiClass { id: string; name: string; code: string; schedule: string; studentIds: string[]; }
interface AlunoRelatorio {
  alunoId: string; nome: string; matricula?: string;
  presencas: number; faltas: number; totalAulas: number;
  pct: number; status: 'Aprovado' | 'Atenção' | 'Risco';
}

function situacao(pct: number): 'Aprovado' | 'Atenção' | 'Risco' {
  if (pct >= 75) return 'Aprovado';
  if (pct >= 50) return 'Atenção';
  return 'Risco';
}
function corSit(s: string) {
  if (s === 'Aprovado') return 'text-green-600';
  if (s === 'Atenção')  return 'text-yellow-600';
  return 'text-red-600';
}

let chartInst: any = null;
function killChart() { if (chartInst) { chartInst.destroy(); chartInst = null; } }

export default function RelatoriosPage() {
  const [turmas, setTurmas]           = useState<ApiClass[]>([]);
  const [filtroId, setFiltroId]       = useState('');
  const [busca, setBusca]             = useState('');
  const [relatorio, setRelatorio]     = useState<AlunoRelatorio[]>([]);
  const [loadingT, setLoadingT]       = useState(true);
  const [loadingR, setLoadingR]       = useState(false);
  const barRef = useRef<HTMLCanvasElement>(null);

  // 1. Carrega turmas do professor
  useEffect(() => {
    const user = getSavedUser();
    if (!user) return;
    fetch(`${API}/classes/teacher/${user.id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()).then(setTurmas).catch(() => {}).finally(() => setLoadingT(false));
  }, []);

  // 2. Quando seleciona turma, busca relatório real
  useEffect(() => {
    killChart();
    if (!filtroId) { setRelatorio([]); return; }

    setLoadingR(true);
    const headers = { Authorization: `Bearer ${getToken()}` };

    // Busca chamadas + alunos em paralelo
    Promise.all([
      fetch(`${API}/attendance/turma/${filtroId}`, { headers }).then(r => r.json()),
      fetch(`${API}/classes/${filtroId}/dashboard`, { headers }).then(r => r.json()),
    ]).then(async ([chamadas, dashData]) => {
      if (!dashData.studentIds?.length) { setRelatorio([]); return; }

      const students = await fetch(
        `${API}/users/by-ids?ids=${dashData.studentIds.join(',')}`, { headers }
      ).then(r => r.json()).catch(() => []);

      const totalAulas = chamadas.length;

      const lista: AlunoRelatorio[] = students.map((s: any) => {
        const presencas = chamadas.filter((ch: any) => {
          try { return (JSON.parse(ch.presentStudents) as string[]).includes(s.id); }
          catch { return false; }
        }).length;
        const faltas = totalAulas - presencas;
        const pct    = totalAulas > 0 ? Math.round(presencas / totalAulas * 100) : 0;
        return {
          alunoId: s.id, nome: s.name, matricula: s.matricula,
          presencas, faltas, totalAulas, pct, status: situacao(pct),
        };
      });

      lista.sort((a, b) => b.pct - a.pct);
      setRelatorio(lista);
    }).catch(() => setRelatorio([])).finally(() => setLoadingR(false));
  }, [filtroId]);

  // 3. Gráfico de barras por aluno quando a turma tem dados
  useEffect(() => {
    killChart();
    if (!relatorio.length || !barRef.current) return;

    import("chart.js/auto").then((mod) => {
      const Chart = mod.default;
      const dark  = document.documentElement.classList.contains("dark");
      const txt   = dark ? "#ccc" : "#555";
      const grid  = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

      killChart();
      if (!barRef.current) return;
      chartInst = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: relatorio.map(a => a.nome.split(' ')[0]),
          datasets: [{
            label: 'Presença %',
            data: relatorio.map(a => a.pct),
            backgroundColor: relatorio.map(a => a.pct >= 75 ? '#FF6B00' : '#E74C3C'),
            borderRadius: 5, barPercentage: 0.6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100, grid: { color: grid }, ticks: { color: txt, callback: (v: any) => v + '%' } },
            x: { grid: { display: false }, ticks: { color: txt, maxRotation: 30 } },
          },
        },
      });
    });
    return killChart;
  }, [relatorio]);

  // 4. Filtro de busca local
  const filtrado = useMemo(() => {
    if (!busca.trim()) return relatorio;
    return relatorio.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()));
  }, [relatorio, busca]);

  // 5. Exportar CSV
  const exportar = () => {
    const turmaNome = turmas.find(t => t.id === filtroId)?.name ?? 'geral';
    const linhas = filtrado.map(a =>
      `${a.nome},${a.matricula ?? '—'},${a.presencas},${a.faltas},${a.totalAulas},${a.pct}%,${a.status}`
    );
    const csv = ['Nome,Matrícula,Presenças,Faltas,Total Aulas,% Presença,Situação', ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `relatorio-${turmaNome}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const turmaSel = turmas.find(t => t.id === filtroId);
  const mediaT   = relatorio.length
    ? Math.round(relatorio.reduce((s, a) => s + a.pct, 0) / relatorio.length)
    : 0;
  const emRisco  = relatorio.filter(a => a.pct < 75).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Relatórios</h2>

          {/* Filtros — visual idêntico ao original */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">Filtrar por turma</label>
                <select
                  value={filtroId}
                  onChange={e => setFiltroId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  disabled={loadingT}
                >
                  <option value="">{loadingT ? 'Carregando...' : 'Selecione a turma'}</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm">Buscar aluno</label>
                <input
                  type="text" placeholder="Digite o nome..."
                  value={busca} onChange={e => setBusca(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={exportar} disabled={!filtrado.length}
                  className="w-full bg-laranja text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-40"
                >
                  <i className="fas fa-download mr-2" />Exportar CSV
                </button>
              </div>
            </div>
          </div>

          {/* Painel da turma selecionada — com gráfico + stats */}
          {filtroId && turmaSel && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              {loadingR ? (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-spinner fa-spin text-2xl mb-2 block" /> Carregando dados da turma...
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-laranja">{turmaSel.name}</h3>
                    <p className="text-xs text-gray-400">
                      Código: {turmaSel.code} · {turmaSel.schedule || '—'} · {relatorio.length} aluno{relatorio.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {relatorio.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Gráfico barras por aluno */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2 text-center">Presença por Aluno</p>
                        <div style={{ height: 200 }}><canvas ref={barRef} /></div>
                      </div>
                      {/* Stats da turma */}
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Média de presença da turma</p>
                          <p className={`text-2xl font-bold mt-0.5 ${mediaT >= 75 ? 'text-laranja' : 'text-red-500'}`}>{mediaT}%</p>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${mediaT >= 75 ? 'bg-laranja' : 'bg-red-500'}`} style={{ width: `${mediaT}%` }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-red-500">{emRisco}</p>
                            <p className="text-xs text-gray-400">Em risco</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{relatorio.length - emRisco}</p>
                            <p className="text-xs text-gray-400">Aprovados</p>
                          </div>
                        </div>
                        {relatorio[0] && (
                          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                            <i className="fas fa-trophy text-laranja text-sm" />
                            <div>
                              <p className="text-xs text-gray-400">Melhor frequência</p>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{relatorio[0].nome}</p>
                            </div>
                            <span className="ml-auto text-sm font-bold text-laranja">{relatorio[0].pct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Tabela — visual idêntico ao original */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
            {!filtroId ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <i className="fas fa-chart-bar text-4xl mb-4 block" />
                <p>Selecione uma turma para ver o relatório</p>
              </div>
            ) : loadingR ? null : filtrado.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <i className="fas fa-search text-3xl mb-3 block opacity-40" />
                <p className="text-sm">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Relatório de Frequência</h3>
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      {['Aluno','Matrícula','Presenças','Faltas','Total Aulas','%','Situação'].map(h => (
                        <th key={h} className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrado.map(a => (
                      <tr key={a.alunoId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="p-3 font-medium text-gray-800 dark:text-white">{a.nome}</td>
                        <td className="p-3 text-gray-500">{a.matricula ?? '—'}</td>
                        <td className="p-3 font-medium text-green-600">{a.presencas}</td>
                        <td className="p-3 font-medium text-red-500">{a.faltas}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{a.totalAulas}</td>
                        <td className="p-3 font-bold text-gray-800 dark:text-white">{a.pct}%</td>
                        <td className={`p-3 font-semibold ${corSit(a.status)}`}>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
