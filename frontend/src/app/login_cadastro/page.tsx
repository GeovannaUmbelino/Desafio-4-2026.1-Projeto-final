'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/api';

type Mode = 'login' | 'cadastro';
type Role = 'professor' | 'aluno';

export default function LoginCadastroPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('aluno');
  const [matricula, setMatricula] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password, role, matricula: matricula || undefined });
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.postimg.cc/L8XSmccy/logo-acessa.png" 
            alt="Logo EngNet" 
            className="h-16 w-auto" 
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cadastro' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de conta</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['professor', 'aluno'] as Role[]).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border font-medium transition-all ${
                        role === r ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-300 text-gray-600'
                      }`}>
                      {r === 'professor' ? '👨‍🏫 Professor' : '🎒 Aluno'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          {errorMsg && <div className="text-red-500 text-sm text-center">⚠ {errorMsg}</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white py-3 rounded-xl font-bold text-lg transition-all shadow-lg mt-4">
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <p>Ainda não é cadastrado? <button onClick={() => setMode('cadastro')} className="font-bold text-orange-600 hover:underline">
  Cadastre-se
</button></p>
          ) : (
            <p>Já tem cadastro? <button onClick={() => setMode('login')} className="font-bold text-orange-600 hover:underline">Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
}