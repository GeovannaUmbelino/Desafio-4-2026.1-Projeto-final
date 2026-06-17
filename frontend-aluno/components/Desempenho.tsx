'use client';

import { materias } from '@/data/studentData';

export default function Desempenho() {
  const calcPresenca = (presencas: number, aulas: number) => {
    return aulas > 0 ? (presencas / aulas) * 100 : 0;
  };

  const totalAulas = materias.reduce((s, m) => s + m.aulasRealizadas, 0);
  const totalPresencas = materias.reduce((s, m) => s + m.presencas, 0);
  const mediaPresenca = totalAulas > 0 ? (totalPresencas / totalAulas) * 100 : 0;
  const risco = materias.filter(m => calcPresenca(m.presencas, m.aulasRealizadas) < 75).length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Meu Desempenho</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Conselho de Classe</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Média de Presença Geral</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div className="bg-laranja h-4 rounded-full transition-all duration-500" style={{ width: `${mediaPresenca}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{Math.round(mediaPresenca)}% de presença</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Matérias em Risco</p>
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-red-500"></i>
                <span className="text-gray-800 dark:text-white font-semibold">{risco}</span>
                <span className="text-gray-500">matérias com presença abaixo de 75%</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Regra de Aprovação</p>
              <div className="flex items-center gap-2 text-sm">
                <i className="fas fa-graduation-cap text-laranja"></i>
                <span className="text-gray-600 dark:text-gray-400">
                  É necessária <strong className="text-laranja">75% de presença</strong> para aprovação
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Dicas de Melhoria</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <i className="fas fa-lightbulb text-laranja mt-1"></i>
              <span>Mantenha a frequência acima de 75%</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-calendar-check text-laranja mt-1"></i>
              <span>Justifique suas faltas na secretaria</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-chart-line text-laranja mt-1"></i>
              <span>Acompanhe seu desempenho semanalmente</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Legenda de Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-green-700 dark:text-green-300">Aprovado</p>
              <p className="text-xs">Presença ≥ 75%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">Atenção</p>
              <p className="text-xs">Presença 50% a 74%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-red-700 dark:text-red-300">Risco</p>
              <p className="text-xs">Presença &lt; 50%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}