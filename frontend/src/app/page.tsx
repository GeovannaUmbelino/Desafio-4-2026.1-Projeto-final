'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import GraficoPresenca from '@/components/GraficoPresenca';
import { useAuth } from '@/contexts/AuthContext';
import api, { getErrorMessage } from '@/lib/api';



interface DashboardStats {
  totalAlunos: number;
  totalTurmas: number;
  mediaPresenca: number; // 0-100
  baixaFrequencia: {
    alunoId: string;
    presencas: number;
    totalAulas: number;
    porcentagem: number;
  }[];
}


export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/attendance/dashboard')
      .then(res => setStats(res.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.role === 'admin' ? 'Visão geral do sistema' : `Suas turmas, ${user?.name?.split(' ')[0]}`}
              </p>
            </div>
            <button
              onClick={() => { setLoading(true); setError('');
                api.get<DashboardStats>('/attendance/dashboard')
                  .then(r => setStats(r.data)).catch(e => setError(getErrorMessage(e)))
                  .finally(() => setLoading(false)); }}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              ↻ Atualizar
            </button>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Cards de métricas */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card titulo="Total de Alunos"    valor={stats.totalAlunos}            cor="laranja" icone="fa-user-graduate" />
              <Card titulo="Turmas Ativas"      valor={stats.totalTurmas}            cor="roxo"    icone="fa-book-open" />
              <Card titulo="Média de Presença"  valor={`${stats.mediaPresenca}%`}    cor="laranja" icone="fa-chart-line" />
              <Card titulo="Baixa Frequência"   valor={stats.baixaFrequencia.length} cor="vermelho" icone="fa-exclamation-triangle" />
            </div>
          ) : null}

          {/* Gráfico de presença */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-4xl mx-auto mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
              Presença por Turma
            </h3>
            <GraficoPresenca />
          </div>

          {/* Alertas de baixa frequência */}
          {stats && stats.baixaFrequencia.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle" />
                Alunos em risco de reprovação por frequência
              </h3>
              <div className="space-y-2">
                {stats.baixaFrequencia.map(a => (
                  <div key={a.alunoId}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                        {a.porcentagem}%
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          ID: {a.alunoId.slice(0, 8)}…
                        </p>
                        <p className="text-xs text-gray-500">
                          {a.presencas}/{a.totalAulas} presenças
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      a.porcentagem < 50
                        ? 'bg-red-200 text-red-800'
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {a.porcentagem < 50 ? 'Crítico' : 'Atenção'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
