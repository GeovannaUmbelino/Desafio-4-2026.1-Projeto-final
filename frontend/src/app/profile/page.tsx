"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();


  if (!user) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50 dark:bg-gray-900">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=256`;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-gray-900">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          
          
          <h2 className="text-3xl font-extrabold text-[#FF6B00] mb-8 tracking-wide">
            Perfil
          </h2>

          {/* Card Principal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Bloco 1: Avatar e Barra Roxa */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 shadow-sm border-2 border-gray-100 dark:border-gray-700">
                <img 
                  src={avatarUrl} 
                  alt="Avatar do Usuário" 
                  className="w-full h-full object-cover"
                />
              </div>
             
              <div className="w-28 h-3.5 bg-[#8B5CF6] rounded-full"></div>
            </div>

            {/* Bloco 2: Informações do Usuário */}
            <div className="flex-1 space-y-4 w-full md:pl-8 text-gray-700 dark:text-gray-300">
              <p className="text-base">
                Nome: {user.name}
              </p>
              <p className="text-base">
                Email: {user.email}
              </p>
              <p className="text-base">
                Matrícula: {user.matricula || "Não informada"}
              </p>
              <p className="text-base">
                Função: <span className="capitalize">{user.role}</span>
              </p>
            </div>

           
            <div className="flex flex-col gap-4 w-full md:w-48">
              <button 
                onClick={() => alert("Função de excluir em desenvolvimento!")}
                className="w-full bg-[#FF8C32] hover:bg-[#FF6B00] text-white font-medium py-2.5 rounded-lg shadow-sm transition-all"
              >
                Excluir
              </button>
              
              <button 
                onClick={() => alert("Função de editar em desenvolvimento!")}
                className="w-full bg-[#FF8C32] hover:bg-[#FF6B00] text-white font-medium py-2.5 rounded-lg shadow-sm transition-all"
              >
                Editar
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}