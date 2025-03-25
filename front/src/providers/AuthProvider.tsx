'use client';

import { useAuthStore } from '@/store';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que inicializa e sincroniza o estado de autenticação 
 * em toda a aplicação quando ela é carregada
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { syncAuth } = useAuthStore();

  useEffect(() => {
    // Sincroniza o estado de autenticação no carregamento 
    // para garantir consistência entre token e estado
    syncAuth();

    // Sincronizar também quando a janela recebe foco
    // (útil quando o usuário volta de outra aba)
    const handleFocus = () => {
      syncAuth();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncAuth]);

  return <>{children}</>;
} 