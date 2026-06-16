"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentData } from "@/hooks/useStudentData";

type Aba = "dashboard" | "materias" | "faltas" | "desempenho";

const NAV: { id: Aba; label: string; icone: string }[] = [
  { id: "dashboard",  label: "Dashboard",        icone: "fa-tachometer-alt" },
  { id: "materias",   label: "Minhas Matérias",  icone: "fa-book" },
  { id: "faltas",     label: "Registro de Faltas",icone: "fa-calendar-times" },
  { id: "desempenho", label: "Meu Desempenho",   icone: "fa-chart-line" },
];

function pct(a: { presencas: number; totalAulas: number }) {
  return parseFloat((a.presencas / a.totalAulas * 100).toFixed(1));
}

function sit(p: number) {
  if (p >= 75) return { label: "Aprovado", cor: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", dot: "bg-green-500" };
  if (p >= 50) return { label: "Atenção",  cor: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", dot: "bg-yellow-500" };
  return             { label: "Risco",    cor: "text-red-600",    bg: "bg-red-50 dark:bg-red-900/20",     dot: "bg-red-500" };
}

export default function AlunoPage() {
  const { user, logout } = useAuth(); // Importa os dados reais do login
  const { materias, isLoading } = useStudentData(); // Importa as turmas do banco
  
  const [aba, setAba] = useState<Aba>("dashboard");
  const [isDark, setIsDark] = useState(false);

  const totalAulas     = materias.reduce((s, m) => s + m.totalAulas, 0);
  const totalFaltas    = materias.reduce((s, m) => s + (m.totalAulas - m.presencas), 0);
  const mediaPresenca  = materias.length
    ? Math.round(materias.reduce((s, m) => s + pct(m), 0) / materias.length)
    : 0;
  const emRisco = materias.filter(m => pct(m) < 75).length;

  const trocaTema = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const primeiroNome = user?.name?.split(' ')[0] || 'Aluno';
  const inicial = user?.name?.charAt(0).toUpperCase() || 'A';

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-laranja"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      
      {/* SIDEBAR DO ALUNO */}
      <aside className="w-56 min-w-[14rem] bg-white dark:bg-gray-900 flex flex-col h-full border-r border-gray-100 dark:border-gray-800">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-7">
            <div className="w-2 rounded-sm bg-[#9B59B6]" style={{height:"60%"}}/>
            <div className="w-2 rounded-sm bg-[#FF6B00]" style={{height:"85%"}}/>
            <div className="w-2 rounded-sm bg-[#9B59B6]" style={{height:"100%"}}/>
          </div>
          <div>
            <p className="font-bold text-sm text-gray-800 dark:text-white">EngNet</p>
            <p className="text-[10px] text-gray-400 -mt-0.5">Área do Aluno</p>
          </div>
        </div>

        {/* PERFIL REAL */}
        <div className="mx-3 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-bold">
              {inicial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">Matrícula: {user?.matricula || "Pendente"}</p>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setAba(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                aba === item.id
                  ? "bg-[#FF6B00] text-white font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <i className={`fas ${item.icone} w-4`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* CONFIGURAÇÕES E LOGOUT */}
        <div className="px-3 pb-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button onClick={trocaTema}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} w-4`} />
            Modo {isDark ? "claro" : "escuro"}
          </button>
          
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <i className="fas fa-sign-out-alt w-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">

        {aba === "dashboard" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Olá, {primeiroNome}! 👋</h2>
            <p className="text-sm text-gray-400 mt-0.5 mb-6">Resumo do seu desempenho acadêmico</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">Matérias Cursando</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{materias.length}</p>
                <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center mt-2">
                  <i className="fas fa-book text-white" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">Total de Aulas</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{totalAulas}</p>
                <div className="w-10 h-10 rounded-full bg-[#9B59B6] flex items-center justify-center mt-2">
                  <i className="fas fa-chalkboard text-white" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">Presença Média</p>
                <p className={`text-3xl font-bold mt-1 ${mediaPresenca >= 75 ? "text-green-600" : "text-red-500"}`}>{mediaPresenca}%</p>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mt-2">
                  <i className="fas fa-chart-line text-green-600" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400">Total de Faltas</p>
                <p className="text-3xl font-bold text-red-500 mt-1">{totalFaltas}</p>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mt-2">
                  <i className="fas fa-times-circle text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Presença por Matéria</h3>
              <div className="space-y-3">
                {materias.map(({ turma, presencas, totalAulas: total }) => {
                  const p = pct({ presencas, totalAulas: total });
                  const s = sit(p);
                  return (
                    <div key={turma.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{turma.name}</span>
                        <span className={`font-bold ${s.cor}`}>{p}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p >= 75 ? "bg-[#FF6B00]" : p >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {aba === "materias" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Minhas Matérias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {materias.map(({ turma, presencas, totalAulas: total }) => {
                const p    = pct({ presencas, totalAulas: total });
                const s    = sit(p);
                const falt = total - presencas;
                return (
                  <div key={turma.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-[#FF6B00] px-4 py-3">
                      <p className="font-bold text-white text-sm">{turma.name}</p>
                      <p className="text-orange-100 text-xs">{turma.code}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fas fa-clock w-3" /> {turma.schedule || "Sem horário definido"}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Frequência</span>
                          <span className={`font-bold ${s.cor}`}>{p}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p >= 75 ? "bg-[#FF6B00]" : p >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${p}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                        <span className="text-green-600 font-medium">✅ {presencas} presenças</span>
                        <span className="text-red-500 font-medium">❌ {falt} faltas</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {aba === "faltas" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registro de Faltas</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    {["Matéria", "Presenças", "Faltas", "Total Aulas", "% Presença", "Situação"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {materias.map(({ turma, presencas, totalAulas: total }) => {
                    const p = pct({ presencas, totalAulas: total });
                    const s = sit(p);
                    return (
                      <tr key={turma.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{turma.name}</td>
                        <td className="px-4 py-3 font-medium text-green-600">{presencas}</td>
                        <td className="px-4 py-3 font-medium text-red-500">{total - presencas}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{total}</td>
                        <td className={`px-4 py-3 font-bold ${s.cor}`}>{p}%</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.cor}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {aba === "desempenho" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Meu Desempenho</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Conselho de Classe</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Média de Presença Geral</p>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6B00] rounded-full" style={{ width: `${mediaPresenca}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{mediaPresenca}% de presença</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Matérias em Risco</p>
                    <p className={`text-sm font-medium ${emRisco > 0 ? "text-red-500" : "text-green-600"}`}>
                      {emRisco > 0
                        ? `⚠ ${emRisco} matéria${emRisco > 1 ? "s" : ""} com presença abaixo de 75%`
                        : "✅ Todas as matérias em dia"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Regra de Aprovação</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      É necessária <strong className="text-[#FF6B00]">75% de presença</strong> para aprovação
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Dicas de Melhoria</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-lightbulb text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    Mantenha a frequência acima de 75% para evitar reprovação direta.
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-file-alt text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    Justifique suas faltas na secretaria apresentando atestados médicos quando necessário.
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-chart-line text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    Acompanhe seu desempenho semanalmente nesta aba para não ser pego de surpresa.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Legenda de Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: "Aprovado",   sub: "Presença ≥ 75%",    cor: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20",  dot: "bg-green-500" },
                  { label: "Atenção",    sub: "Presença 50% a 74%", cor: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", dot: "bg-yellow-500" },
                  { label: "Risco",      sub: "Presença < 50%",     cor: "text-red-600",   bg: "bg-red-50 dark:bg-red-900/20",    dot: "bg-red-500" },
                ].map(item => (
                  <div key={item.label} className={`rounded-lg p-3 ${item.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                      <span className={`text-sm font-semibold ${item.cor}`}>{item.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}