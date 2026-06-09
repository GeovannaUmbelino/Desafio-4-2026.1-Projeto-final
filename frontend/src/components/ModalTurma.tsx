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
  const { adicionarTurma, editarTurma } = useData();
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    horario: "",
    total: 10,
  });

  useEffect(() => {
    if (turmaEditando) {
      setFormData({
        nome: turmaEditando.nome,
        codigo: turmaEditando.codigo,
        horario: turmaEditando.horario,
        total: turmaEditando.total,
      });
    } else {
      setFormData({ nome: "", codigo: "", horario: "", total: 10 });
    }
  }, [turmaEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Digite o nome da turma");
      return;
    }
    if (!formData.codigo.trim()) {
      alert("Digite o código da turma");
      return;
    }

    if (turmaEditando) {
      editarTurma({
        ...turmaEditando,
        ...formData,
        horario: formData.horario || "Horário não definido",
      });
    } else {
      adicionarTurma({
        id: Date.now(),
        nome: formData.nome,
        codigo: formData.codigo,
        horario: formData.horario || "Horário não definido",
        total: formData.total,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {turmaEditando ? "Editar Turma" : "Nova Turma"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da turma"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Código"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Horário (Ex: 14:00 - 16:00)"
            value={formData.horario}
            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="number"
            placeholder="Quantos alunos?"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })}
            className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-laranja text-white py-2 rounded-lg hover:bg-orange-600 transition-all">
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}