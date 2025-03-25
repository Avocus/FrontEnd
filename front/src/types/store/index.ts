import { User } from '../entities/User';
import { Credentials } from '../entities/User';
import { AgendaState } from '../entities/Evento';
import { NotificacaoState } from '../entities/Notificacao';
import { ProfileState } from '../entities/Profile';

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