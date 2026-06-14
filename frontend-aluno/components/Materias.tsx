'use client';

import { materias } from '@/data/studentData';

export default function Materias() {
  const calcPresenca = (presencas: number, aulas: number) => {
    return aulas > 0 ? (presencas / aulas) * 100 : 0;
  };

  const getStatus = (presenca: number) => {
    if (presenca >= 75) return { texto: 'Aprovado', cor: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900' };
    if (presenca >= 50) return { texto: 'Atenção', cor: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900' };
    return { texto: 'Risco', cor: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900' };
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Minhas Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map(m => {
          const presenca = calcPresenca(m.presencas, m.aulasRealizadas);
          const status = getStatus(presenca);
          return (
            <div key={m.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:translate-x-1 hover:shadow-xl">
              <div className="bg-laranja p-4">
                <h3 className="text-xl font-bold text-white">{m.nome}</h3>
                <p className="text-white text-opacity-90 text-sm">{m.codigo}</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="fas fa-chalkboard-teacher w-5"></i>
                  <span>{m.professor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <i className="fas fa-clock w-5"></i>
                  <span>{m.horario}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Frequência</span>
                    <span className={`text-sm font-semibold ${status.cor}`}>{presenca.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-laranja h-2 rounded-full transition-all duration-500" style={{ width: `${presenca}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm">
                    <span className="text-green-600">✅ {m.presencas} presenças</span>
                    <span className="text-red-500">❌ {m.faltas} faltas</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}