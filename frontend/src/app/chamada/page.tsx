"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";

export default function ChamadaPage() {
  const { turmas, alunos, atualizarPresenca } = useData();
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

  const alunosFiltrados = turmaSelecionada
    ? alunos.filter(a => a.turmaId === turmaSelecionada)
    : [];

  const turmaAtual = turmas.find(t => t.id === turmaSelecionada);

  const registrarPresenca = (alunoId: number, presente: boolean) => {
    const aluno = alunos.find(a => a.id === alunoId);
    if (presente && aluno && aluno.presencas < aluno.totalAulas) {
      atualizarPresenca(alunoId, presente);
      alert(`Presença de ${aluno.nome} registrada`);
    } else if (!presente) {
      alert(`Falta de ${aluno?.nome} registrada`);
    } else if (presente && aluno && aluno.presencas >= aluno.totalAulas) {
      alert(`${aluno.nome} já atingiu o limite de presenças!`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Registrar Chamada</h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Selecione a turma</label>
            <select
              value={turmaSelecionada || ""}
              onChange={(e) => setTurmaSelecionada(parseInt(e.target.value) || null)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Escolha uma turma</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {!turmaSelecionada ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <i className="fas fa-hand-pointer text-4xl mb-4"></i>
                <p>Escolha uma turma para começar</p>
              </div>
            ) : alunosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-users-slash text-4xl mb-4"></i>
                <p>Nenhum aluno cadastrado nesta turma</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Chamada - {new Date().toLocaleDateString()} - {turmaAtual?.nome}
                </h3>
                {alunosFiltrados.map(aluno => {
                  const percentual = Math.round(aluno.presencas / aluno.totalAulas * 100);
                  return (
                    <div key={aluno.id} className="flex justify-between items-center p-4 border rounded-lg mb-2 dark:border-gray-700">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">
                          {aluno.presencas}/{aluno.totalAulas} ({percentual}%)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => registrarPresenca(aluno.id, true)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                          Presente
                        </button>
                        <button
                          onClick={() => registrarPresenca(aluno.id, false)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                          Falta
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}