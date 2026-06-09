"use client";

import { useData } from "@/contexts/DataContext";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import GraficoPresenca from "@/components/GraficoPresenca";

export default function Home() {
  const { turmas, alunos } = useData();

  const totalAlunos = alunos.length;
  const totalTurmas = turmas.length;
  const somaPresencas = alunos.reduce((s, a) => s + (a.presencas / a.totalAulas), 0);
  const mediaPresenca = alunos.length > 0 ? Math.round((somaPresencas / alunos.length) * 100) : 0;
  const baixaFrequencia = alunos.filter(a => (a.presencas / a.totalAulas) < 0.7).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card titulo="Total de Alunos" valor={totalAlunos} cor="laranja" icone="fa-user-graduate" />
            <Card titulo="Turmas Ativas" valor={totalTurmas} cor="roxo" icone="fa-book-open" />
            <Card titulo="Média de Presença" valor={`${mediaPresenca}%`} cor="laranja" icone="fa-chart-line" />
            <Card titulo="Baixa Frequência" valor={baixaFrequencia} cor="vermelho" icone="fa-exclamation-triangle" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
              Presença por Turma
            </h3>
            <GraficoPresenca />
          </div>
        </div>
      </main>
    </div>
  );
}