"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext"; // Importa o logout para o caso de exclusão

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  
  // Estados para os campos editáveis
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const { logout } = useAuth();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('engnet_user') ?? 'null');
      setUser(saved);
      if (saved) {
        setNovoNome(saved.name || "");
        setNovoEmail(saved.email || "");
      }
    } catch (e) {
      console.error("Erro ao carregar dados do perfil:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50 dark:bg-gray-900">
        <i className="fas fa-spinner fa-spin text-2xl text-orange-500" />
      </div>
    );
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('engnet_token') ?? '' : '';
  const inicial = user?.name?.charAt(0).toUpperCase() || 'U';

  // 💡 FUNÇÃO: Atualizar dados da conta (Editar)
  const handleSalvarEdicao = async () => {
    setErro("");
    setSucesso("");
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: novoNome, email: novoEmail })
      });

      if (!res.ok) throw new Error("Falha ao atualizar dados.");

      const usuarioAtualizado = await res.json();
      
      // Atualiza o localStorage e o estado da tela
      localStorage.setItem('engnet_user', JSON.stringify(usuarioAtualizado));
      setUser(usuarioAtualizado);
      setEditando(false);
      setSucesso("Perfil atualizado com sucesso!");
    } catch (err: any) {
      setErro(err.message || "Erro ao atualizar.");
    }
  };

  // 💡 FUNÇÃO: Excluir a conta definitivamente
  const handleExcluirConta = async () => {
    const confirmar = window.confirm("Tem certeza absoluta que deseja excluir sua conta? Esta ação não pode ser desfeita e você perderá acesso ao sistema.");
    if (!confirmar) return;

    setErro("");
    try {
      const res = await fetch(`${API}/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Não foi possível excluir a conta.");

      // Limpa a sessão e desloga o usuário automaticamente após deletar do banco
      logout();
    } catch (err: any) {
      setErro(err.message || "Erro ao excluir conta.");
    }
  };

  const renderBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <span className="inline-block text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/50">👑 Administrador</span>;
      case 'professor':
        return <span className="inline-block text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900/50">👨‍🏫 Professor Titular</span>;
      case 'aluno':
      default:
        return <span className="inline-block text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-md border border-orange-100 dark:border-orange-900/50">🎓 Aluno Regular</span>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl mt-8 space-y-6">
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meu Perfil</h2>
            {/* Botão de Editar / Alternar Modo */}
            {!editando ? (
              <button 
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <i className="fas fa-edit text-orange-500" /> Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditando(false)}
                  className="px-3 py-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSalvarEdicao}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  Salvar Mudanças
                </button>
              </div>
            )}
          </div>

          {erro && <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-xl text-xs border border-red-100">{erro}</div>}
          {sucesso && <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-xs border border-green-100">{sucesso}</div>}
          
          {/* Cabeçalho do Perfil */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-orange-600 text-white font-extrabold text-2xl flex items-center justify-center border shadow-2xs flex-shrink-0">
              {user?.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{inicial}</span>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              {editando ? (
                <input 
                  type="text" 
                  value={novoNome} 
                  onChange={e => setNovoNome(e.target.value)}
                  className="px-3 py-1 text-lg font-bold border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {user?.name || 'Usuário do Sistema'}
                </h3>
              )}
              <div className="pt-1">
                {renderBadge(user?.role)}
              </div>
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Bloco de E-mail */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  E-mail Cadastrado
                </span>
                {editando ? (
                  <input 
                    type="email" 
                    value={novoEmail} 
                    onChange={e => setNovoEmail(e.target.value)}
                    className="w-full text-sm px-3 py-1 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white font-semibold"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 block truncate">
                    {user?.email || 'Não informado'}
                  </span>
                )}
              </div>
              
              {/* Bloco de Matrícula (Bloqueado para edição por segurança institucional) */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 opacity-85">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  {user?.role === 'aluno' ? 'Número de Matrícula' : 'Identificação Funcional'}
                </span>
                <span className="text-sm font-mono font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <i className="fas fa-lock text-gray-300 text-xs" />
                  {user?.matricula || user?.id?.substring(0, 8).toUpperCase() || 'Sem registro'}
                </span>
              </div>

            </div>

            {/* ID Interno */}
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs">
              <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                ID Interno do Sistema (UUID)
              </span>
              <span className="font-mono text-gray-400 block truncate">
                {user?.id || '00000000-0000-0000-0000-000000000000'}
              </span>
            </div>
          </div>

          {/* 💡 SEÇÃO: Zona de Perigo (Excluir Conta) */}
          <div className="pt-6 border-t border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Desativar conta institucional</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Todos os seus registros históricos de chamada serão preservados.</p>
            </div>
            <button
              onClick={handleExcluirConta}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all"
            >
              Excluir Conta
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}