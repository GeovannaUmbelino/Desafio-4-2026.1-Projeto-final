"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";

export default function RelatoriosPage() {
  const { turmas, alunos } = useData();
  const [filtroTurma, setFiltroTurma] = useState<number | null>(null);
  const [buscaAluno, setBuscaAluno] = useState("");

  const alunosFiltrados = useMemo(() => {
    let filtrados = filtroTurma
      ? alunos.filter(a => a.turmaId === filtroTurma)
      : [...alunos];
    
    if (buscaAluno) {
      filtrados = filtrados.filter(a =>
        a.nome.toLowerCase().includes(buscaAluno.toLowerCase())
      );
    }
    
    return filtrados;
  }, [alunos, filtroTurma, buscaAluno]);

  const exportarRelatorio = () => {
    const relatorio = alunosFiltrados.map(a => {
      const turma = turmas.find(t => t.id === a.turmaId);
      const percentual = (a.presencas / a.totalAulas * 100).toFixed(1);
      const status = parseFloat(percentual) >= 75 ? "Aprovado" : "Reprovado";
      return `${a.nome},${turma?.nome || "-"},${percentual}%,${status}`;
    });
    
    const csv = ["Nome,Turma,Percentual,Situação", ...relatorio].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `relatorio-frequencia-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Relatórios</h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Filtrar por turma</label>
                <select
                  value={filtroTurma || ""}
                  onChange={(e) => setFiltroTurma(parseInt(e.target.value) || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Todas as turmas</option>
                  {turmas.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Buscar aluno</label>
                <input
                  type="text"
                  placeholder="Digite o nome..."
                  value={buscaAluno}
                  onChange={(e) => setBuscaAluno(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={exportarRelatorio}
                  className="w-full bg-laranja text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
                  disabled={alunosFiltrados.length === 0}
                >
                  <i className="fas fa-download mr-2"></i>Exportar CSV
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
            {alunosFiltrados.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <i className="fas fa-chart-bar text-4xl mb-4"></i>
                <p>Nenhum aluno encontrado</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Relatório de Frequência</h3>
                <table className="w-full min-w-[500px]">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Aluno</th>
                      <th className="p-3 text-left">Turma</th>
                      <th className="p-3 text-left">Presenças</th>
                      <th className="p-3 text-left">%</th>
                      <th className="p-3 text-left">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosFiltrados.map(aluno => {
                      const turma = turmas.find(t => t.id === aluno.turmaId);
                      const percentual = (aluno.presencas / aluno.totalAulas * 100).toFixed(1);
                      const status = parseFloat(percentual) >= 75;
                      return (
                        <tr key={aluno.id} className="border-b dark:border-gray-700">
                          <td className="p-3 text-gray-800 dark:text-white">{aluno.nome}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-400">{turma?.nome || "-"}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-400">{aluno.presencas}/{aluno.totalAulas}</td>
                          <td className="p-3 font-semibold text-gray-800 dark:text-white">{percentual}%</td>
                          <td className={`p-3 font-semibold ${status ? 'text-green-600' : 'text-red-600'}`}>
                            {status ? '✅ Aprovado' : '❌ Reprovado'}
                          </td>
                        </tr>
                      );
                    })}
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