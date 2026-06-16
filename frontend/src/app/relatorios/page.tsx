"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiClass {
  id: string;
  name: string;
  code: string;
}

interface RelatorioAluno {
  studentId: string;
  name: string;
  matricula: string;
  presencas: number;
  faltas: number;
  totalAulas: number;
  pct: number;
}

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<ApiClass[]>([]);
  const [filtroId, setFiltroId] = useState("");
  const [relatorio, setRelatorio] = useState<RelatorioAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('engnet_token') ?? '';
    const headers = { Authorization: `Bearer ${token}` };
    
    const url = user.role === 'admin' ? `${API}/classes` : `${API}/classes/teacher/${user.id}`;

    fetch(url, { headers })
      .then(r => r.json())
      .then((data) => setTurmas(Array.isArray(data) ? data : []))
      .catch(() => setErro("Erro ao carregar lista de turmas para o relatório."));
  }, [user]);

  useEffect(() => {
    if (!filtroId) {
      setRelatorio([]);
      return;
    }

    setLoading(true);
    setErro("");
    const token = localStorage.getItem('engnet_token') ?? '';

    fetch(`${API}/attendance/metrics/class/${filtroId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setRelatorio(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setErro("Não foi possível consolidar o relatório desta turma.");
        setLoading(false);
      });
  }, [filtroId]);

  const turmaSel = Array.isArray(turmas) ? turmas.find(t => t.id === filtroId) : undefined;
  
  const mediaT = relatorio && relatorio.length
    ? Math.round(relatorio.reduce((s, a) => s + (a?.pct ?? 0), 0) / relatorio.length)
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* CABEÇALHO */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-xs">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Relatórios de Frequência</h2>
              <p className="text-xs text-gray-400 mt-0.5">Selecione uma disciplina para auditar a porcentagem de faltas e presenças gerais.</p>
            </div>
            
            <select
              value={filtroId}
              onChange={e => setFiltroId(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm bg-white"
            >
              <option value="">Escolha uma disciplina...</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
              ))}
            </select>
          </div>

          {erro && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs">⚠ {erro}</div>}

          {/* PAINEL CONSOLIDADO */}
          {filtroId && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Matéria Selecionada</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-1 truncate">{turmaSel?.name ?? "N/A"}</p>
                <p className="text-xs text-orange-500 font-mono mt-0.5">{turmaSel?.code}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Média de Presença</p>
                <p className={`text-3xl font-extrabold mt-1 ${mediaT >= 75 ? "text-green-600" : "text-red-500"}`}>{mediaT}%</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Meta institucional: Mínimo 75%</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Alunos Monitorados</p>
                <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-1">{relatorio.length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Estudantes ativos na lista de chamada</p>
              </div>
            </div>
          )}

          {/* TABELA DE ALUNOS */}
          {filtroId && !loading && relatorio.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border shadow-xs overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 font-bold uppercase border-b">
                  <tr>
                    <th className="px-6 py-3.5">Nome do Aluno</th>
                    <th className="px-6 py-3.5">Matrícula</th>
                    <th className="px-6 py-3.5 text-center">Presenças</th>
                    <th className="px-6 py-3.5 text-center">Faltas</th>
                    <th className="px-6 py-3.5 text-center">Total Aulas</th>
                    <th className="px-6 py-3.5 text-right">Frequência</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {relatorio.map(aluno => (
                    <tr key={aluno.studentId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{aluno.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{aluno.matricula}</td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold">{aluno.presencas}</td>
                      <td className="px-6 py-4 text-center text-red-500 font-bold">{aluno.faltas}</td>
                      <td className="px-6 py-4 text-center text-gray-400">{aluno.totalAulas}</td>
                      <td className={`px-6 py-4 text-right font-extrabold text-base ${aluno.pct >= 75 ? "text-green-600" : "text-red-500"}`}>
                        {aluno.pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 text-gray-400 text-sm">
              <i className="fas fa-spinner fa-spin mr-2 text-orange-500 text-lg" />
              Consolidando diário e gerando gráficos de desempenho...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}