"use client";

import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Turma } from "@/types";

interface ModalTurmaProps {
  isOpen: boolean;
  onClose: () => void;
  turmaEditando?: Turma | null;
}

export default function ModalTurma({ isOpen, onClose, turmaEditando }: ModalTurmaProps) {
  const { criarTurma, editarTurma } = useData();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    schedule: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (turmaEditando) {
      setFormData({
        name: turmaEditando.name,
        code: turmaEditando.code,
        schedule: turmaEditando.schedule,
      });
    } else {
      setFormData({ name: "", code: "", schedule: "" });
    }
    setErro(null);
  }, [turmaEditando, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!formData.name.trim()) { setErro("Digite o nome da turma"); return; }
    if (!formData.code.trim()) { setErro("Digite o código da turma"); return; }

    const teacherId = localStorage.getItem("userId") || "";
    if (!teacherId) { setErro("Usuário não identificado. Faça login novamente."); return; }

    setSalvando(true);
    try {
      if (turmaEditando) {
        await editarTurma(turmaEditando.id, {
          name: formData.name,
          code: formData.code,
          schedule: formData.schedule || "Horário não definido",
        });
      } else {
        await criarTurma({
          name: formData.name,
          code: formData.code,
          teacherId,
          schedule: formData.schedule || "Horário não definido",
        });
      }
      onClose();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar turma");
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {turmaEditando ? "Editar Turma" : "Nova Turma"}
        </h3>

        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{erro}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da turma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={salvando}
          />
          <input
            type="text"
            placeholder="Código (ex: MAT0025)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={salvando}
          />
          <input
            type="text"
            placeholder="Horário (ex: 14:00 - 16:00)"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={salvando}
          />
          <div className="flex gap-3">
            <button type="submit" disabled={salvando}
              className="flex-1 bg-laranja text-white py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50">
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={onClose} disabled={salvando}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}