import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Credentials, AuthState } from '@/types';
import { getToken, setToken, removeToken } from '@/utils/authUtils';
import { loginUsuario } from '@/services/user/loginService';

const authChannel = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

const checkInitialAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!getToken();
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
            const data = await loginUsuario({
              email: credentials.email,
              password: credentials.password,
            });

            const token: string = data.jwt;

            const user: User = {
              nome: data.name,
              client: data.client,
              token
            }
            
            setToken(token);
            
            set({ user, isAuthenticated: true, isLoading: false });
            authChannel?.postMessage({ type: 'login' });
            return user;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        logout: () => {
          removeToken();
          set({ user: null, isAuthenticated: false, error: null });
          authChannel?.postMessage({ type: 'logout' });
        },
        setError: (error: string | null) => set({ error }),
        syncAuth: () => {
          const hasToken = !!getToken();
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