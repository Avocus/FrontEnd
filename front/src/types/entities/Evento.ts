/**
 * Interface que representa um evento de agenda
 */
export interface Evento {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  tipo: EventoTipo;
  status?: EventoStatus;
  cor: EventoCor;
  localizacao?: string;
  processoId?: string;
  advogadoId?: string;
  clienteId?: string;
  convidados?: string[];
  notificarPorEmail?: boolean;
  emailNotificado?: boolean;
  lembrarAntes?: number; // minutos antes para lembrar
}

export enum EventoTipo {
  AUDIENCIA = 'AUDIENCIA',
  REUNIAO = 'REUNIAO',
  PRAZO = 'PRAZO',
  OUTRO = 'OUTRO'
}

export enum EventoStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export enum EventoCor {
  AZUL = '#3B82F6',
  VERDE = '#10B981',
  AMARELO = '#F59E0B',
  VERMELHO = '#EF4444',
  ROXO = '#8B5CF6',
  ROSA = '#EC4899',
  CIANO = '#06B6D4',
  LARANJA = '#F97316',
  CINZA = '#6B7280',
  INDIGO = '#6366F1'
}

export interface EventoFiltro {
  tipo?: EventoTipo[];
  status?: EventoStatus[];
  cor?: EventoCor[];
  dataInicio?: Date;
  dataFim?: Date;
}

/**
 * Interface para notificação de evento
 */
export interface EventoNotificacao {
  eventoId: string;
  email: string;
  titulo: string;
  dataEvento: Date;
  enviado: boolean;
  dataEnvio?: Date;
}

/**
 * Interface para o estado da agenda
 */
export interface AgendaState {
  eventos: Evento[];
  eventoSelecionado: Evento | null;
  isLoading: boolean;
  error: string | null;
  filtros: EventoFiltro;
  
  loadEventos: () => Promise<void>;
  selectEvento: (id: string) => void;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<Evento>;
  updateEvento: (id: string, eventoAtualizado: Partial<Evento>) => Promise<void>;
  removeEvento: (id: string) => Promise<void>;
  clearSelection: () => void;
  getEventosByDate: (date: Date) => Evento[];
  getEventosProximos: (dias?: number) => Evento[];
  getEventosPassados: (dias?: number) => Evento[];
  setFiltros: (filtros: Partial<EventoFiltro>) => void;
  clearFiltros: () => void;
  marcarEmailNotificado: (eventoId: string) => void;
  getEventosParaNotificar: () => Evento[];
} 