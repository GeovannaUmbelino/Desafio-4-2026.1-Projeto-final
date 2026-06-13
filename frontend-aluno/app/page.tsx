'use client';

import Dashboard from '@/components/Dashboard';
import Materias from '@/components/Materias';
import Faltas from '@/components/Faltas';
import Desempenho from '@/components/Desempenho';

export default function Home() {
  return (
    <div>
      <div id="page-dashboard">
        <Dashboard />
      </div>
      
      <div id="page-materias" className="hidden">
        <Materias />
      </div>
      
      <div id="page-faltas" className="hidden">
        <Faltas />
      </div>
      
      <div id="page-desempenho" className="hidden">
        <Desempenho />
      </div>
    </div>
  );
}