"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/api';

type Mode = 'login' | 'cadastro';
type Role = 'professor' | 'aluno';

export default function LoginCadastroPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('aluno');
  const [matricula, setMatricula] = useState('');

  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleRemoverFoto = () => {
    setFoto(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        if (matricula) formData.append('matricula', matricula);
        if (foto) formData.append('foto', foto);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao realizar o cadastro.');
        }

        
        alert('Conta criada com sucesso! Faça login para acessar o sistema.');
        setMode('login');
        setPassword('');
        handleRemoverFoto();
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.postimg.cc/L8XSmccy/logo-acessa.png" 
            alt="Logo EngNet" 
            className="h-16 w-auto" 
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'cadastro' && (
            <>
              {/*Upload de Imagem de Perfil */}
              <div className="flex flex-col items-center space-y-3 mb-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider self-start">Foto de Perfil</label>
                
                <div className="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-500 overflow-hidden group shadow-inner">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <i className="fas fa-camera text-2xl text-gray-400" />
                  )}
                </div>

                {!previewUrl ? (
                  <label className="cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs">
                    <i className="fas fa-upload mr-1.5 text-orange-500" /> Selecionar Foto
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFotoChange} className="hidden" />
                  </label>
                ) : (
                  <button type="button" onClick={handleRemoverFoto} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
                    <i className="fas fa-trash-alt mr-1" /> Remover imagem
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de conta</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['professor', 'aluno'] as Role[]).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border font-bold transition-all text-sm ${
                        role === r 
                          ? 'border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400' 
                          : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                      }`}>
                      {r === 'professor' ? 'Professor' : 'Aluno'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matrícula</label>
                <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
          </div>

          {errorMsg && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-950/20 py-2 rounded-xl border border-red-100 dark:border-red-900/50">⚠ {errorMsg}</div>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white py-3 rounded-xl font-bold text-lg transition-all shadow-lg mt-4 disabled:opacity-50">
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' ? (
            <p>Ainda não é cadastrado? <button onClick={() => setMode('cadastro')} className="font-bold text-orange-600 dark:text-orange-400 hover:underline">
              Cadastre-se
            </button></p>
          ) : (
            <p>Já tem cadastro? <button onClick={() => setMode('login')} className="font-bold text-orange-600 dark:text-orange-400 hover:underline">Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
}