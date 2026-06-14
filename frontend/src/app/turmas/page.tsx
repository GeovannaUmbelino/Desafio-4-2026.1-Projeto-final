"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";
import { Turma } from "@/types";

export default function TurmasPage() {
  const { turmas, alunos, adicionarTurma, editarTurma, deletarTurma } = useData();
  const [modalAberto, setModalAberto] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState<Turma | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    horario: "",
    total: 10,
  });

  const verAlunos = (turmaId: number) => {
    const turma = turmas.find(t => t.id === turmaId);
    const lista = alunos.filter(a => a.turmaId === turmaId);
    const texto = lista.map(a => `${a.nome} - ${Math.round(a.presencas / a.totalAulas * 100)}%`).join("\n");
    alert(`Alunos de ${turma?.nome}:\n\n${texto || "Nenhum aluno"}`);
  };

  const abrirModal = (turma?: Turma) => {
    if (turma) {
      setTurmaEditando(turma);
      setFormData({
        nome: turma.nome,
        codigo: turma.codigo,
        horario: turma.horario,
        total: turma.total,
      });
    } else {
      setTurmaEditando(null);
      setFormData({ nome: "", codigo: "", horario: "", total: 10 });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTurmaEditando(null);
  };

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
      alert(`Turma "${formData.nome}" atualizada!`);
    } else {
      adicionarTurma({
        id: Date.now(),
        nome: formData.nome,
        codigo: formData.codigo,
        horario: formData.horario || "Horário não definido",
        total: formData.total,
      });
      alert(`Turma "${formData.nome}" criada com sucesso!`);
    }
    
    fecharModal();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Minhas Turmas</h2>
            <button
              onClick={() => abrirModal()}
              className="bg-laranja text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all"
            >
              <i className="fas fa-plus mr-2"></i>Nova Turma
            </button>
          </div>

          {turmas.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <i className="fas fa-folder-open text-5xl text-gray-400 mb-3"></i>
              <p className="text-gray-500 dark:text-gray-400">Nenhuma turma cadastrada</p>
              <button
                onClick={() => abrirModal()}
                className="mt-3 bg-laranja text-white px-4 py-2 rounded-lg"
              >
                <i className="fas fa-plus mr-2"></i>Criar primeira turma
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.map((turma) => (
                <div key={turma.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{turma.nome}</h3>
                      <p className="text-sm text-gray-500">Código: {turma.codigo}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => abrirModal(turma)} className="text-laranja hover:text-orange-600">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => {
                        if (confirm(`Remover "${turma.nome}"?`)) {
                          deletarTurma(turma.id);
                          alert(`Turma "${turma.nome}" removida!`);
                        }
                      }} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    <i className="fas fa-clock mr-2"></i>{turma.horario}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    <i className="fas fa-users mr-2"></i>{turma.total} alunos
                  </p>
                  <button
                    onClick={() => verAlunos(turma.id)}
                    className="w-full bg-laranja text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition-all"
                  >
                    Ver alunos
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalAberto && (
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
                required
              />
              <input
                type="text"
                placeholder="Código"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
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
                required
              />

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-laranja text-white py-2 rounded-lg hover:bg-orange-600 transition-all">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}