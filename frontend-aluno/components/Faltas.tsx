'use client';

import { materias } from '@/data/studentData';

export default function Faltas() {
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
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Registro de Faltas</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left text-gray-700 dark:text-gray-300">Matéria</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-300">Professor</th>
                <th className="p-4 text-center text-gray-700 dark:text-gray-300">Presenças</th>
                <th className="p-4 text-center text-gray-700 dark:text-gray-300">Faltas</th>
                <th className="p-4 text-center text-gray-700 dark:text-gray-300">Total Aulas</th>
                <th className="p-4 text-center text-gray-700 dark:text-gray-300">% Presença</th>
                <th className="p-4 text-center text-gray-700 dark:text-gray-300">Situação</th>
              </tr>
            </thead>
            <tbody>
              {materias.map(m => {
                const presenca = calcPresenca(m.presencas, m.aulasRealizadas);
                const status = getStatus(presenca);
                return (
                  <tr key={m.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 font-medium">{m.nome}</td>
                    <td className="p-4 text-gray-600">{m.professor}</td>
                    <td className="p-4 text-center text-green-600 font-semibold">{m.presencas}</td>
                    <td className="p-4 text-center text-red-500 font-semibold">{m.faltas}</td>
                    <td className="p-4 text-center text-gray-600">{m.aulasRealizadas}</td>
                    <td className="p-4 text-center"><span className={`font-bold ${status.cor}`}>{presenca.toFixed(1)}%</span></td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.cor}`}>
                        {status.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}