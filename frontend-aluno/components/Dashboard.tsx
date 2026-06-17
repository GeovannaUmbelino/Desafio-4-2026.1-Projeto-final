'use client';

import { useEffect, useRef } from 'react';
import { materias, alunoAtual } from '@/data/studentData';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const calcPresenca = (presencas: number, aulas: number) => {
    return aulas > 0 ? (presencas / aulas) * 100 : 0;
  };

  const totalMaterias = materias.length;
  const totalAulas = materias.reduce((s, m) => s + m.aulasRealizadas, 0);
  const totalPresencas = materias.reduce((s, m) => s + m.presencas, 0);
  const totalFaltas = materias.reduce((s, m) => s + m.faltas, 0);
  const mediaPresenca = totalAulas > 0 ? (totalPresencas / totalAulas) * 100 : 0;
  const risco = materias.filter(m => calcPresenca(m.presencas, m.aulasRealizadas) < 75).length;

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const dark = document.documentElement.classList.contains('dark');
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: materias.map(m => m.nome),
          datasets: [{
            label: 'Presença (%)',
            data: materias.map(m => calcPresenca(m.presencas, m.aulasRealizadas)),
            backgroundColor: '#FF6B00',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } },
            x: { ticks: { font: { size: 11 } } }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Olá, {alunoAtual.nome.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Resumo do seu desempenho acadêmico</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Matérias Cursando</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{totalMaterias}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-laranja">
              <i className="fas fa-book text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total de Aulas</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{totalAulas}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-roxo">
              <i className="fas fa-chalkboard text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Presença Média</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{Math.round(mediaPresenca)}%</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900">
              <i className="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total de Faltas</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{totalFaltas}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <i className="fas fa-calendar-times text-red-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">Presença por Matéria</h3>
        <div className="h-80">
          <canvas ref={chartRef} id="graficoPresencaMaterias"></canvas>
        </div>
      </div>
    </div>
  );
}