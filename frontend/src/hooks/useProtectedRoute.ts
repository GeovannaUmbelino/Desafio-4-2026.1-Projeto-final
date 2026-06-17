import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export function useProtectedRoute(
  allowedRoles: UserRole[] = [],
  redirectTo = '/login_cadastro',
) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
   
    if (isLoading) return;

   
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    
    if (allowedRoles.length === 0) return;

    if (user && !allowedRoles.includes(user.role)) {
      const fallback: Record<UserRole, string> = {
        admin:     '/',
        professor: '/chamada',
        aluno:     '/aluno',
      };
      router.replace(fallback[user.role] ?? '/');
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router]);

  return { user, isLoading };
}
