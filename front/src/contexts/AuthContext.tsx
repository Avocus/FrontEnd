'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store';

interface AuthConfig {
  requireAuth?: boolean;
  redirectTo?: string;
}

interface AuthContextType {
  config: AuthConfig;
  updateAuth: (newConfig: AuthConfig) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AuthConfig>({
    requireAuth: true,
    redirectTo: '/login'
  });

  const { syncAuth } = useAuthStore();

  const updateAuth = useCallback((newConfig: AuthConfig) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  }, []);

  useEffect(() => {
    syncAuth();

    const handleFocus = () => {
      syncAuth();
    };

    const authChannel = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'login' || e.data.type === 'logout') {
        syncAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    authChannel?.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      authChannel?.removeEventListener('message', handleMessage);
      authChannel?.close();
    };
  }, [syncAuth]);

  return (
    <AuthContext.Provider value={{ config, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 