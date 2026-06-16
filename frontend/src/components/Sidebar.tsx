"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// Importe o hook de autenticação (ajuste o caminho se necessário)
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  
  // 1. Extraindo os dados do usuário e a função de logout do Contexto
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const trocaTema = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  // 2. Definindo quais perfis podem ver quais menus
  const menuItems = [
    { nome: "Início", href: "/", icone: "fa-tachometer-alt", roles: ['admin', 'professor', 'aluno'] },
    { nome: "Turmas", href: "/turmas", icone: "fa-users", roles: ['admin', 'professor'] },
    { nome: "Chamada", href: "/chamada", icone: "fa-check-circle", roles: ['admin', 'professor'] },
    { nome: "Relatórios", href: "/relatorios", icone: "fa-chart-line", roles: ['admin', 'professor'] },
    { nome: "Meu Desempenho", href: "/aluno", icone: "fa-user-graduate", roles: ['aluno'] },
  ];

  // 3. Filtrando o menu baseado na role do usuário logado
  const menusPermitidos = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto z-20 flex flex-col justify-between h-screen">
      
      {/* SEÇÃO SUPERIOR: Logo e Navegação */}
      <div>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/img/logo_engnet.png"
                alt="Logo EngNet"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-laranja">EngNet</h1>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menusPermitidos.map((item) => {
            const isAtivo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isAtivo
                    ? "bg-laranja text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-laranja hover:text-white hover:translate-x-1"
                }`}
              >
                <i className={`fas ${item.icone} w-5`}></i>
                <span>{item.nome}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SEÇÃO INFERIOR: Perfil do Usuário, Tema e Logout */}
      <div>
        {/* Renderiza o perfil apenas se o usuário estiver logado */}
        {user && (
          <div className="p-4 mx-4 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300 truncate">
              {user.email}
            </span>
            <span className="text-xs font-bold text-laranja uppercase tracking-wider mt-1">
              {user.role}
            </span>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={trocaTema}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
            <span>{isDark ? "Modo claro" : "Modo escuro"}</span>
          </button>

          {/* 4. Botão de Logout real conectado ao Contexto */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair do sistema</span>
          </button>
        </div>
      </div>

    </aside>
  );
}