"use client";

import { usePathname, useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isDark, setIsDark] = useState(false);
  const [abaInterna, setAbaInterna] = useState('dashboard');
  
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const abaSalva = localStorage.getItem('engnet_current_tab') ?? 'dashboard';
    setAbaInterna(abaSalva);
  }, []);

  const trocaTema = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleTrocaAba = (idAba: string) => {
    localStorage.setItem('engnet_current_tab', idAba);
    setAbaInterna(idAba);
    window.dispatchEvent(new Event('storage'));
  };

  const menuItems = [
    { id: "dashboard",       nome: "Dashboard",       icone: "fa-tachometer-alt", roles: ['admin', 'professor', 'aluno'], urlFisica: "/" },
    { id: "meu perfil",      nome: "Meu Perfil",      icone: "fa-user-circle",    roles: ['admin', 'professor', 'aluno'], urlFisica: "/perfil" },
    { id: "minhas materias", nome: "Minhas Matérias",  icone: "fa-users",          roles: ['aluno'] },
    { id: "meu desempenho",  nome: "Meu Desempenho",  icone: "fa-user-graduate",  roles: ['aluno'] },
    { id: "turmas",          nome: "Turmas",          icone: "fa-users",          roles: ['admin', 'professor'], urlFisica: "/turmas" },
    { id: "chamada",         nome: "Chamada",         icone: "fa-check-circle",   roles: ['admin', 'professor'], urlFisica: "/chamada" },
    { id: "relatorios",      nome: "Relatórios",      icone: "fa-chart-line",     roles: ['admin', 'professor'], urlFisica: "/relatorios" },
  ];

  const menusPermitidos = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const inicial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto z-20 flex flex-col justify-between h-screen border-r border-gray-100 dark:border-gray-700">
      
      <div>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-full">
            <div className="relative w-44 flex items-center justify-center">
              <img 
                src="https://i.postimg.cc/L8XSmccy/logo-acessa.png" 
                alt="Logo Acessa" 
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menusPermitidos.map((item) => {
            
            const isAtivo = pathname === item.urlFisica || (user?.role === 'aluno' && abaInterna === item.id && pathname === '/');

            const executarClique = () => {
              if (user?.role === 'aluno') {
                handleTrocaAba(item.id);
                if (pathname !== '/') {
                  router.push('/'); 
                }
              } else if (item.urlFisica) {
                router.push(item.urlFisica); 
              }
            };

            return (
              <button
                key={`sidebar-btn-item-${item.id}`}
                onClick={executarClique}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${
                  isAtivo
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 hover:translate-x-1"
                }`}
              >
                <i className={`fas ${item.icone} w-5 text-base`}></i>
                <span>{item.nome}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {user && (
          <div className="p-4 mx-4 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 flex items-center gap-3 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold overflow-hidden border border-gray-200 dark:border-gray-500 flex-shrink-0 shadow-sm">
              {user.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{inicial}</span>
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate -mt-0.5">
                {user.email}
              </p>
              <span className="inline-block text-[9px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-md mt-1 border border-orange-100 dark:border-orange-900/50">
                {user.role === 'aluno' ? 'Aluno' : user.role === 'professor' ? 'Professor' : 'Admin'}
              </span>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={trocaTema}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 font-bold text-xs border transition-all"
          >
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} text-orange-500`}></i>
            <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs transition-all"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>

    </aside>
  );
}