"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentData } from "@/hooks/useStudentData";

type Aba = "dashboard" | "materias" | "faltas" | "desempenho" | "perfil";

const NAV: { id: Aba; label: string; icone: string }[] = [
  { id: "dashboard",  label: "Dashboard",        icone: "fa-tachometer-alt" },
  { id: "materias",   label: "Minhas Matérias",  icone: "fa-book" },
  { id: "faltas",     label: "Registro de Faltas",icone: "fa-calendar-times" },
  { id: "desempenho", label: "Meu Desempenho",    icone: "fa-chart-line" },
  { id: "perfil",     label: "Meu Perfil",        icone: "fa-user" },
];

function pct(a: { presencas: number; totalAulas: number }) {
  if (!a.totalAulas || a.totalAulas === 0) return 0;
  return parseFloat((a.presencas / a.totalAulas * 100).toFixed(1));
}

function sit(p: number) {
  if (p >= 75) return { label: "Aprovado", cor: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", dot: "bg-green-500" };
  if (p >= 50) return { label: "Atenção",  cor: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", dot: "bg-yellow-500" };
  return             { label: "Risco",    cor: "text-red-600",   bg: "bg-red-50 dark:bg-red-900/20",     dot: "bg-red-500" };
}

export default function AlunoPage() {
  const { user, logout } = useAuth();
  const { materias, isLoading } = useStudentData();
  
  const [aba, setAba] = useState<Aba>("dashboard");
  const [isDark, setIsDark] = useState(false);

  // Estados para edição e controle do perfil
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState(user?.name || "");
  const [novoEmail, setNovoEmail] = useState(user?.email || "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const totalAulas     = materias.reduce((s, m) => s + (m.totalAulas || 0), 0);
  const totalFaltas    = materias.reduce((s, m) => s + ((m.totalAulas || 0) - (m.presencas || 0)), 0);
  const mediaPresenca  = materias.length
    ? Math.round(materias.reduce((s, m) => s + pct(m), 0) / materias.length)
    : 0;
  const emRisco = materias.filter(m => pct(m) < 75).length;

  const trocaTema = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const primeiroNome = user?.name?.split(' ')[0] || 'Aluno';
  const inicial = user?.name?.charAt(0).toUpperCase() || 'A';

  const handleSalvarPerfil = async () => {
    setErro("");
    setSucesso("");
    try {
      const token = localStorage.getItem('engnet_token') ?? '';
      const res = await fetch(`${API}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: novoNome, email: novoEmail })
      });

      if (!res.ok) throw new Error("Falha ao atualizar dados do perfil.");

      const usuarioAtualizado = await res.json();
      localStorage.setItem('engnet_user', JSON.stringify(usuarioAtualizado));
      setEditando(false);
      setSucesso("Perfil atualizado com sucesso!");
      window.location.reload();
    } catch (err: any) {
      setErro(err.message || "Erro ao atualizar.");
    }
  };

  const handleExcluirConta = async () => {
    const confirmar = window.confirm("Tem certeza absoluta que deseja excluir sua conta institucional? Essa ação removerá seu acesso e não poderá ser desfeita.");
    if (!confirmar) return;

    setErro("");
    try {
      const token = localStorage.getItem('engnet_token') ?? '';
      const res = await fetch(`${API}/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Não foi possível processar a exclusão.");
      logout();
    } catch (err: any) {
      setErro(err.message || "Erro ao excluir conta.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      
      {/* SIDEBAR DO ALUNO */}
      <aside className="w-56 min-w-[14rem] bg-white dark:bg-gray-900 flex flex-col h-full border-r border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="relative w-44 flex items-center justify-center">
              <img 
                src="https://i.postimg.cc/L8XSmccy/logo-acessa.png" 
                alt="Logo Acessa" 
                className="w-full h-auto object-contain select-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">
              Área do Aluno
            </p>
          </div>
        </div>

        {/* PERFIL DA SIDEBAR */}
        <div className="mx-3 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all" onClick={() => setAba("perfil")}>
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
                {materias.map((m) => {
                  const p = pct(m);
                  const s = sit(p);
                  const nomeMateria = m.turma?.name || (m as any).name || "Componente Curricular";
                  const idMateria = m.turma?.id || (m as any).id;       
                  return (
                    <div key={idMateria}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{nomeMateria}</span>
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

        {/* ... (as abas materias, faltas e desempenho seguem o mesmo padrão) ... */}
        {aba === "materias" && (
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Minhas Matérias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {materias.map((m) => {
                const p    = pct(m);
                const s    = sit(p);
                const falt = (m.totalAulas || 0) - (m.presencas || 0);
                const nomeMateria = m.turma?.name || (m as any).name || "Componente Curricular";
                const codigoMateria = m.turma?.code || (m as any).code || "MAT";
                const idMateria = m.turma?.id || m.id;
                return (
                  <div key={idMateria} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-[#FF6B00] px-4 py-3">
                      <p className="font-bold text-white text-sm">{nomeMateria}</p>
                      <p className="text-orange-100 text-xs">{codigoMateria}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="fas fa-clock w-3" /> {m.turma?.schedule || (m as any).schedule || "Horário de Aula"}
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
                        <span className="text-green-600 font-medium">✅ {m.presencas} presenças</span>
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
                  {materias.map((m) => {
                    const p = pct(m);
                    const s = sit(p);
                    const nomeMateria = m.turma?.name || (m as any).name || "Componente Curricular";
                    const idMateria = m.turma?.id || m.id;
                    return (
                      <tr key={idMateria} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{nomeMateria}</td>
                        <td className="px-4 py-3 font-medium text-green-600">{m.presencas}</td>
                        <td className="px-4 py-3 font-medium text-red-500">{(m.totalAulas || 0) - (m.presencas || 0)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{m.totalAulas}</td>
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
                      {emRisco > 0 ? `⚠ ${emRisco} matéria em risco` : "✅ Todas as matérias em dia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 👑 ABA MEU PERFIL: Totalmente estilizada idêntica ao Professor/Admin */}
        {aba === "perfil" && (
          <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
            
            {/* Header da Página */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Meu Perfil</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gerencie suas informações e preferências cadastrais</p>
              </div>

              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 transition-all cursor-pointer"
                >
                  <i className="fas fa-edit text-[#FF6B00]" /> Editar Perfil
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditando(false); setNovoNome(user?.name || ""); setNovoEmail(user?.email || ""); }}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvarPerfil}
                    className="px-4 py-2.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-500/10 transition-all cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>

            {/* Alertas e Notificações */}
            {erro && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-4 py-3.5 rounded-xl text-xs font-medium border border-red-100 dark:border-red-900/30 shadow-xs">
                <i className="fas fa-exclamation-circle text-base" /> {erro}
              </div>
            )}
            {sucesso && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-4 py-3.5 rounded-xl text-xs font-medium border border-green-100 dark:border-green-900/30 shadow-xs">
                <i className="fas fa-check-circle text-base" /> {sucesso}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card Esquerdo - Avatar & Badge */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF6B00] to-orange-400 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                  {inicial}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-full">{user?.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-3">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-[#FF6B00] text-[10px] font-bold uppercase tracking-wider rounded-full">
                  <i className="fas fa-graduation-cap text-xs" /> Aluno Regular
                </span>
              </div>

              {/* Card Direito - Campos Formuário Grid */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700 p-6 space-y-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-700 pb-3">Informações Cadastrais</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Campo Nome */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nome Completo</label>
                    {editando ? (
                      <input
                        type="text"
                        value={novoNome}
                        onChange={e => setNovoNome(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6B00] transition-all"
                      />
                    ) : (
                      <div className="w-full text-xs px-3 py-2.5 bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold">
                        {user?.name}
                      </div>
                    )}
                  </div>

                  {/* Campo Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">E-mail Institucional</label>
                    {editando ? (
                      <input
                        type="email"
                        value={novoEmail}
                        onChange={e => setNovoEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6B00] transition-all"
                      />
                    ) : (
                      <div className="w-full text-xs px-3 py-2.5 bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold block truncate">
                        {user?.email || "Não informado"}
                      </div>
                    )}
                  </div>

                  {/* Campo Matrícula (Bloqueado) */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Número de Matrícula</label>
                    <div className="w-full text-xs px-3 py-2.5 bg-gray-50/80 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-mono font-bold flex items-center gap-2 select-none">
                      <i className="fas fa-lock text-gray-300 dark:text-gray-700 text-xs" />
                      {user?.matricula || user?.id?.substring(0, 8).toUpperCase()}
                    </div>
                  </div>

                  {/* Campo Status do Vínculo */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status do Vínculo</label>
                    <div className="w-full text-xs px-3 py-2.5 bg-gray-50/80 dark:bg-gray-700/20 border border-gray-100 dark:border-gray-800 text-green-600 dark:text-green-500 rounded-xl font-bold flex items-center gap-2 select-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Matriculado Ativo
                    </div>
                  </div>

                </div>

                {/* Zona de Perigo - Exclusão de Conta Institucional */}
                <div className="pt-6 border-t border-dashed border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">Encerrar Conta Estudantil</h5>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Ao excluir, seu histórico de presença e chamadas será desvinculado.</p>
                  </div>
                  <button
                    onClick={handleExcluirConta}
                    className="px-4 py-2 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap text-center"
                  >
                    Excluir Conta
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}