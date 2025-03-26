import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Credentials, AuthState } from '@/types';

const checkInitialAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem('token');
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: checkInitialAuth(),
        isLoading: false,
        error: null,
        login: async (credentials: Credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                method: 'server'
              }),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Falha na autenticação');
            }
            
            const data = await response.json();

            const token: string = data.jwt;

            const user: User = {
              nome: data.name,
              client: data.client,
              token
            }
            
            sessionStorage.setItem("token", token);
            
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        logout: () => {
          sessionStorage.removeItem("token");
          set({ user: null, isAuthenticated: false, error: null });
        },
        setError: (error: string | null) => set({ error }),
        syncAuth: () => {
          const hasToken = checkInitialAuth();
          const { isAuthenticated } = get();
          
          if (hasToken !== isAuthenticated) {
            if (hasToken) {
              set({ isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    )
  )
); 