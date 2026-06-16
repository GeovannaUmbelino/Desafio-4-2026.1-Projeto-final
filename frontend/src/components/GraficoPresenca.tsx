"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import { useReports } from "@/hooks/useReports";

const LARANJA  = "#FF6B00";
const ROXO     = "#9B59B6";
const VERMELHO = "#E74C3C";
const VERDE    = "#2ECC71";

const TURMA_CORES = [LARANJA, "#FF9A3C", ROXO, VERMELHO, VERDE];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow text-sm">
      {label && <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" && p.name?.includes("%") ? p.value + "%" : p.value}
          {typeof p.value === "number" && !p.name?.includes("%") && p.name !== "faltas" ? "%" : ""}
        </p>
      ))}
    </div>
  );
}

export default function GraficoPresenca() {
  const { turmas, alunos } = useReports();

  const dadosPresencaPorTurma = turmas.map((t) => {
    const alunosDaTurma = alunos.filter((a) => a.turmaId === t.id);
    const media =
      alunosDaTurma.length > 0
        ? Math.round(
            (alunosDaTurma.reduce((s, a) => s + a.presencas / a.totalAulas, 0) /
              alunosDaTurma.length) *
              100
          )
        : 0;
    return { turma: t.name, presenca: media };
  });

  const mediaGeral =
    alunos.length > 0
      ? Math.round(
          (alunos.reduce((s, a) => s + a.presencas / a.totalAulas, 0) / alunos.length) * 100
        )
      : 0;

  const dadosRosca = [
    { name: "Presença", value: mediaGeral },
    { name: "Falta", value: 100 - mediaGeral },
  ];
  const coresRosca = [mediaGeral >= 75 ? LARANJA : VERMELHO, "#E5E7EB"];

  const dadosFaltas = [...alunos]
    .map((a) => ({
      nome: a.nome.split(" ")[0], 
      faltas: a.totalAulas - a.presencas,
    }))
    .sort((a, b) => b.faltas - a.faltas)
    .slice(0, 8);

  const semanas = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
  const dadosSemanal = semanas.map((sem, indexSemana) => {
    const ponto: Record<string, string | number> = { semana: sem };
    turmas.forEach((t, indexTurma) => {
      const base = dadosPresencaPorTurma.find((d) => d.turma === t.name)?.presenca ?? 80;
      // Ajustado para não usar o t.id na matemática, pois agora é uma string UUID
      const variacao = ((indexSemana * 7 + indexTurma) % 15) - 7;
      ponto[t.name] = Math.min(100, Math.max(0, base + variacao));
    });
    return ponto;
  });

  if (turmas.length === 0) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
        Nenhuma turma cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-center">
          Presença por Turma
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dadosPresencaPorTurma} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="turma"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="presenca" name="Presença" radius={[4, 4, 0, 0]}>
              {dadosPresencaPorTurma.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.presenca >= 75 ? TURMA_CORES[i % TURMA_CORES.length] : VERMELHO}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-center">
          Média de Frequência Geral
        </h3>
        <div className="relative flex items-center justify-center" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dadosRosca}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {dadosRosca.map((_, i) => (
                  <Cell key={i} fill={coresRosca[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [`${v}%`, name]}
                contentStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-extrabold"
              style={{ color: mediaGeral >= 75 ? LARANJA : VERMELHO }}
            >
              {mediaGeral}%
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">média geral</span>
          </div>
        </div>
        <div className="flex justify-center gap-5 mt-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: mediaGeral >= 75 ? LARANJA : VERMELHO }} />
            Presença ({mediaGeral}%)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full inline-block bg-gray-200" />
            Falta ({100 - mediaGeral}%)
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-center">
          Faltas por Aluno (geral)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={dadosFaltas}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="nome"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              width={70}
            />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(v) => [v, "faltas"]}
            />
            <Bar dataKey="faltas" name="faltas" radius={[0, 4, 4, 0]}>
              {dadosFaltas.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.faltas >= 3 ? VERMELHO : LARANJA}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-center">
          Frequência por Turma / Semana
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dadosSemanal} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="semana" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            {turmas.map((t, i) => (
              <Line
                key={t.id}
                type="monotone"
                dataKey={t.name}
                stroke={TURMA_CORES[i % TURMA_CORES.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}