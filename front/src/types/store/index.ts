import { User } from '@/types/entities/User';
import { Credentials } from '@/types/entities/User';
import { AgendaState } from '@/types/entities/Evento';
import { NotificacaoState } from '@/types/entities/Notificacao';
import { ProfileState } from '@/types/entities/Profile';

/**
 * Interface para o estado de autenticação
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: Credentials) => Promise<User>;
  logout: () => void;
  setError: (error: string | null) => void;
  syncAuth: () => void;
}

/**
 * Interface para o estado do tema
 */
export interface ThemeState {
  theme: 'light' | 'dark';
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Re-exportação para facilitar o uso
export type { AgendaState };
export type { NotificacaoState };
export type { ProfileState }; 