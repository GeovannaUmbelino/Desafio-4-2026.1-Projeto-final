'use client';

import { useState, useEffect } from 'react';
import { alunoAtual } from '@/data/studentData';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Sidebar({ darkMode, setDarkMode }: SidebarProps) {
  const [activePage, setActivePage] = useState('dashboard');

  // Função para mudar de página sem usar router
  const changePage = (page: string) => {
    setActivePage(page);
    
    // Esconder todas as páginas
    const pages = ['dashboard', 'materias', 'faltas', 'desempenho'];
    pages.forEach(p => {
      const element = document.getElementById(`page-${p}`);
      if (element) {
        element.classList.add('hidden');
      }
    });
    
    // Mostrar a página selecionada
    const selectedPage = document.getElementById(`page-${page}`);
    if (selectedPage) {
      selectedPage.classList.remove('hidden');
    }
    
    // Atualizar URL sem recarregar
    window.history.pushState({}, '', page === 'dashboard' ? '/' : `/${page}`);
  };

  // Detectar quando o usuário usa os botões de voltar/avançar
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'dashboard';
      changePage(path);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Inicializar com a página correta
    const initialPath = window.location.pathname.slice(1) || 'dashboard';
    changePage(initialPath);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto z-20">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img 
            src="/img/logo_engnet.png" 
            alt="Logo EngNet" 
            className="w-10 h-10 rounded-lg object-cover"
            />
          <div>
            <h1 className="text-xl font-bold text-laranja">EngNet</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Área do Aluno</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-laranja flex items-center justify-center text-white text-xl font-bold">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">{alunoAtual.nome}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Matrícula: {alunoAtual.matricula}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {[
          { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
          { id: 'materias', icon: 'fa-book-open', label: 'Minhas Matérias' },
          { id: 'faltas', icon: 'fa-calendar-times', label: 'Registro de Faltas' },
          { id: 'desempenho', icon: 'fa-chart-line', label: 'Meu Desempenho' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => changePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-laranja hover:text-white hover:translate-x-1 ${
              activePage === item.id 
                ? 'bg-laranja text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-72 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-laranja hover:text-white"
        >
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          <span>{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </div>
    </aside>
  );
}