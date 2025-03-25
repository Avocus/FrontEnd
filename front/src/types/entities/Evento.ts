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
  localizacao?: string;
  processoId?: string;
  advogadoId?: string;
  clienteId?: string;
  convidados?: string[];
}

/**
 * Enum com os tipos de evento
 */
export enum EventoTipo {
  AUDIENCIA = 'AUDIENCIA',
  REUNIAO = 'REUNIAO',
  PRAZO = 'PRAZO',
  OUTRO = 'OUTRO'
}

/**
 * Enum com os status de evento
 */
export enum EventoStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

/**
 * Interface para o estado da agenda
 */
export interface AgendaState {
  eventos: Evento[];
  eventoSelecionado: Evento | null;
  isLoading: boolean;
  error: string | null;
  
  loadEventos: () => Promise<void>;
  selectEvento: (id: string) => void;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<Evento>;
  updateEvento: (id: string, eventoAtualizado: Partial<Evento>) => Promise<void>;
  removeEvento: (id: string) => Promise<void>;
  clearSelection: () => void;
  getEventosByDate: (date: Date) => Evento[];
} 