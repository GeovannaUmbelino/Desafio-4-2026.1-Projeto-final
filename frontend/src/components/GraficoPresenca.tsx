"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";

export default function GraficoPresenca() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { turmas, alunos } = useData();
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (!canvasRef.current || turmas.length === 0) return;

    // Destruir gráfico anterior se existir
    if (chart) {
      chart.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const nomes = turmas.map(t => t.nome);
    const valores = turmas.map(t => {
      const alunosTurma = alunos.filter(a => a.turmaId === t.id);
      if (alunosTurma.length === 0) return 0;
      const soma = alunosTurma.reduce((s, a) => s + (a.presencas / a.totalAulas), 0);
      return (soma / alunosTurma.length) * 100;
    });

    const cores = ['#FF6B00', '#9B59B6', '#3498DB', '#2ECC71', '#E74C3C', '#1ABC9C'];

    const isDark = document.documentElement.classList.contains("dark");
    const corTexto = isDark ? "#fff" : "#000";
    const corGrid = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    import("chart.js/auto").then((Chart) => {
      const novoChart = new Chart.default(ctx, {
        type: "bar",
        data: {
          labels: nomes,
          datasets: [
            {
              label: "Presença (%)",
              data: valores,
              backgroundColor: cores,
              borderRadius: 6,
              barPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: corGrid },
              ticks: {
                color: corTexto,
                callback: (v: any) => v + "%",
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                color: corTexto,
                font: { size: 12, weight: "bold" },
                maxRotation: 0,
                minRotation: 0,
                autoSkip: true,
                maxTicksLimit: 6,
              },
            },
          },
        },
      });
      setChart(novoChart);
    });

    return () => {
      if (chart) chart.destroy();
    };
  }, [turmas, alunos]);

  // Atualizar gráfico quando tema mudar
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chart) {
        const isDark = document.documentElement.classList.contains("dark");
        const corTexto = isDark ? "#fff" : "#000";
        const corGrid = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
        chart.options.scales.y.grid.color = corGrid;
        chart.options.scales.y.ticks.color = corTexto;
        chart.options.scales.x.ticks.color = corTexto;
        chart.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [chart]);

  return (
    <div className="h-72">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}