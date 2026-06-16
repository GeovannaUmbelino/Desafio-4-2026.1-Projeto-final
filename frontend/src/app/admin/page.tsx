"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { usuarios, isLoading, fetchUsuarios, criarUsuario, deletarUsuario } = useUsers();

  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "professor" as "professor" | "aluno" | "admin",
    matricula: "",
  });

 
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace("/login_cadastro");
      } else if (user.role !== "admin") {
        router.replace("/"); // Expulsa quem não é admin
      }
    }
  }, [user, isAuthLoading, router]);

  // Carrega os usuários
  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsuarios();
    }
  }, [user, fetchUsuarios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sucesso = await criarUsuario(formData);
    if (sucesso) {
      alert("Usuário criado com sucesso!");
      setModalAberto(false);
      setFormData({ name: "", email: "", password: "", role: "professor", matricula: "" });
    }
  };

  const handleDeletar = async (id: string, name: string) => {
    if (confirm(`Atenção! Deseja mesmo excluir o usuário ${name}?`)) {
      await deletarUsuario(id);
    }
  };

 
  if (isAuthLoading || user?.role !== "admin") {
    return <div className="flex h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  const totalProfessores = usuarios.filter(u => u.role === "professor").length;
  const totalAlunos = usuarios.filter(u => u.role === "aluno").length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Painel do Administrador</h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os acessos ao sistema</p>
            </div>
            <button
              onClick={() => setModalAberto(true)}
              className="bg-[#FF6B00] text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-user-plus"></i> Novo Usuário
            </button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{usuarios.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total de Usuários</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00] text-xl">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalProfessores}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Professores</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-[#9B59B6] text-xl">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalAlunos}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Alunos</p>
              </div>
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-laranja"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">E-mail</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Função</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Matrícula</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-4 font-medium text-gray-800 dark:text-white">{u.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full ${
                          u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          u.role === 'professor' ? 'bg-orange-100 text-[#FF6B00]' :
                          'bg-purple-100 text-[#9B59B6]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.matricula || "-"}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeletar(u.id, u.name)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                          title="Excluir Usuário"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>

      
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Novo Usuário
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Senha Provisória</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-[#FF6B00]"
                  >
                    <option value="professor">Professor</option>
                    <option value="aluno">Aluno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Matrícula</label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FF6B00] text-white py-2.5 rounded-lg hover:bg-orange-600 font-medium transition-all"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}