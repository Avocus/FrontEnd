'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Componente que protege rotas que necessitam de autenticação
 * 
 * @param props.children - O conteúdo a ser renderizado se autenticado
 * @param props.requireAuth - Se true, redireciona para login caso não autenticado (default: true)
 * @param props.redirectTo - Para onde redirecionar caso não autenticado (default: '/login')
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { isAuthenticated, logout, syncAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Sincronizar o estado de autenticação com o sessionStorage
    syncAuth();
    
    // Verificação de autenticação após sincronização
    const token = sessionStorage.getItem('token');
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
        router.push(redirectTo);
      }
    } 
    // Se está na página de login ou cadastro mas já está autenticado
    else if (!requireAuth && isLoggedIn) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/home';
      sessionStorage.removeItem('redirectAfterLogin');
      setIsRedirecting(true);
      router.push(redirectPath);
    }
    
    setIsChecking(false);
  }, [isAuthenticated, requireAuth, redirectTo, router, logout, isRedirecting, syncAuth]);

  // Mostra tela de carregamento enquanto verifica autenticação
  if (isChecking) {
    return <LoadingScreen />;
  }

  // Se tudo estiver ok, renderiza os filhos
  return <>{children}</>;
} 