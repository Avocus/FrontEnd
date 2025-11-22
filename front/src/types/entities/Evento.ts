import { TipoProcesso } from '@/types/enums';
import { ProcessoStatus } from './Processo';

export interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  tipo: EventoTipo;
  status: EventoStatus;
  cor: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  diasLembrarAntes: number;
  notificarPorEmail: boolean;
  cliente?: ClienteBasico;
  processo?: ProcessoBasico;
  advogado?: AdvogadoBasico;
  processoId: number | undefined;
  clienteId: number | undefined;
}

export interface ClienteBasico {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface ProcessoBasico {
  id: number;
  titulo: string;
  descricao: string;
  status: ProcessoStatus;
  tipoProcesso: TipoProcesso;
  cliente?: ClienteBasico;
  advogado?: AdvogadoBasico;
}

export interface AdvogadoBasico {
  id: number;
  nome: string;
  cpf: string;
  oab: string;
  email: string;
}

export interface CreateEventoPayload {
  titulo: string;
  descricao: string;
  tipo: EventoTipo;
  status: EventoStatus;
  cor: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  diasLembrarAntes: number;
  notificarPorEmail: boolean;
}

export interface UpdateEventoPayload extends CreateEventoPayload {
  clienteId?: number;
  processoId?: number;
}

export type ValidatedUpdateEventoPayload =
  | (UpdateEventoPayload & { processoId?: undefined; clienteId?: number })
  | (UpdateEventoPayload & { processoId: number; clienteId: number });

export interface EventosResponse {
  data: Evento[];
  message: string;
  status: number;
  params: Record<string, any>;
  error: Record<string, any>;
}

/**
 * Resposta da API para evento único
 */
export interface EventoResponse {
  data: Evento;
  message: string;
  status: number;
  params: Record<string, any>;
  error: Record<string, any>;
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

/**
 * Interface para o estado da agenda
 */
export interface AgendaState {
  eventos: Evento[];
  eventoSelecionado: Evento | null;
  isLoading: boolean;
  error: string | null;

  loadEventos: () => Promise<void>;
  selectEvento: (id: number) => void;
  addEvento: (evento: ValidatedUpdateEventoPayload) => Promise<Evento>;
  updateEvento: (id: number, eventoAtualizado: Partial<Evento>) => Promise<void>;
  removeEvento: (id: number) => Promise<void>;
  clearSelection: () => void;
  getEventosByDate: (date: Date) => Evento[];
  getEventosProximos: (dias?: number) => Evento[];
  getEventosPassados: (dias?: number) => Evento[];
  getEventosParaNotificar: () => Evento[];
} 