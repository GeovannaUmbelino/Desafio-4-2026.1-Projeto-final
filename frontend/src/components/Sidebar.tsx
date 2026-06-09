"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";  // ← Adicione esta linha

export default function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const trocaTema = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const menuItems = [
    { nome: "Início", href: "/", icone: "fa-tachometer-alt" },
    { nome: "Turmas", href: "/turmas", icone: "fa-users" },
    { nome: "Chamada", href: "/chamada", icone: "fa-check-circle" },
    { nome: "Relatórios", href: "/relatorios", icone: "fa-chart-line" },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto z-20 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* Substitua esta div pela imagem */}
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

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
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

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={trocaTema}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-laranja hover:text-white transition-all"
        >
          <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          <span>{isDark ? "Modo claro" : "Modo escuro"}</span>
        </button>
      </div>
    </aside>
  );
}