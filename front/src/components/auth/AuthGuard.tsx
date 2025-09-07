'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas que necessitam de autenticação
 * 
 * @param props.children - O conteúdo a ser renderizado se autenticado
 */
export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const { isAuthenticated, logout, syncAuth } = useAuthStore();
  const { config } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Sincronizar o estado de autenticação com o sessionStorage
      await syncAuth();
      
      // Verificação de autenticação após sincronização
      const token = sessionStorage.getItem('token');
      const isLoggedIn = !!token && isAuthenticated;

      // Evitar múltiplos redirecionamentos
      if (isRedirecting) {
        return;
      }

      // Se precisamos de autenticação e não está autenticado
      if (config.requireAuth && !isLoggedIn) {
        // Armazenar a URL atual para redirecionamento após login
        const currentPath = window.location.pathname;
        if (currentPath !== config.redirectTo) {
          sessionStorage.setItem('redirectAfterLogin', currentPath);
          setIsRedirecting(true);
          router.push(config.redirectTo || '/login');
        }
      } 
      // Se está na página de login ou cadastro mas já está autenticado
      else if (!config.requireAuth && isLoggedIn) {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/home';
        sessionStorage.removeItem('redirectAfterLogin');
        setIsRedirecting(true);
        router.push(redirectPath);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, config, router, logout, isRedirecting, syncAuth]);

  // Mostra tela de carregamento enquanto verifica autenticação
  if (isChecking || isRedirecting) {
    return <LoadingScreen />;
  }

  // Se precisamos de autenticação e não está autenticado, não renderiza nada
  if (config.requireAuth && !isAuthenticated) {
    return null;
  }

  // Se tudo estiver ok, renderiza os filhos
  return <>{children}</>;
} 