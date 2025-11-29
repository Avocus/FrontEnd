/**
 * Interface que representa uma notificação
 */
export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: NotificacaoTipo;
  dataHora: string;
  lida: boolean;
  link?: string;
  usuarioId?: string;
}

/**
 * Enum com os tipos de notificação
 */
export enum NotificacaoTipo {
  INFO = 'INFO',
  ALERTA = 'ALERTA',
  ERRO = 'ERRO',
  SUCESSO = 'SUCESSO'
}

/**
 * Interface para o estado de notificações
 */
export interface NotificacaoState {
  notificacoes: Notificacao[];
  naoLidas: number;
  isLoading: boolean;
  error: string | null;
  isWebSocketConnected: boolean;
  addNotification: (notificacao: Omit<Notificacao, 'id' | 'dataHora' | 'lida'>) => void;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => void;
  loadNotifications: () => Promise<void>;
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
} 