'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { getToken } from '@/utils/authUtils';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login'
}: AuthGuardProps) {
  const { isAuthenticated, logout, syncAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Sincronizar o estado de autenticação com o sessionStorage
      await syncAuth();
      
      // Verificação de autenticação após sincronização
      const token = getToken();
      const isLoggedIn = !!token && isAuthenticated;

      // Evitar múltiplos redirecionamentos
      if (isRedirecting) {
        return;
      }

      // Se precisamos de autenticação e não está autenticado
      if (requireAuth && !isLoggedIn) {
        // Armazenar a URL atual para redirecionamento após login
        const currentPath = window.location.pathname;
        if (currentPath !== redirectTo) {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
          setIsRedirecting(true);
          router.push(redirectTo || '/login');
        }
      } 
      // Se está na página de login ou cadastro mas já está autenticado
      else if (!requireAuth && isLoggedIn) {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        setIsRedirecting(true);
        router.push(redirectPath);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, router, logout, isRedirecting, syncAuth, requireAuth, redirectTo]);

  // Mostra tela de carregamento enquanto verifica autenticação
  if (isChecking || isRedirecting) {
    return <LoadingScreen />;
  }

  // Se precisamos de autenticação e não está autenticado, não renderiza nada
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Se tudo estiver ok, renderiza os filhos
  return <>{children}</>;
} 