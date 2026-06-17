'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export type UserRole = 'admin' | 'professor' | 'aluno';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricula?: string;
}

interface LoginCredentials { email: string; password: string }
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  matricula?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = 'engnet_token';
const USER_KEY  = 'engnet_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser  = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    
    document.cookie = `${TOKEN_KEY}=${newToken}; path=/; max-age=86400; SameSite=Lax`;
    
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Login 
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
        '/auth/login',
        credentials,
      );
      persistSession(data.accessToken, data.user);

      const redirectMap: Record<UserRole, string> = {
        admin:     '/',         
        professor: '/chamada',
        aluno:     '/aluno',    
      };
      router.replace(redirectMap[data.user.role] ?? '/');
    },
    [persistSession, router],
  );

  // Register 
  const register = useCallback(
    async (data: RegisterData) => {
      const { data: res } = await api.post<{ accessToken: string; user: AuthUser }>(
        '/auth/register',
        data,
      );
      persistSession(res.accessToken, res.user);
      
      const redirectMap: Record<UserRole, string> = {
        admin:     '/',         
        professor: '/chamada',
        aluno:     '/aluno',    
      };
      router.replace(redirectMap[data.role] ?? '/');
    },
    [persistSession, router],
  );

  // Logout 
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    setToken(null);
    setUser(null);
    router.replace('/login_cadastro');
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}