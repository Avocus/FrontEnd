import { StatusProcesso, TipoProcesso } from '@/types/enums';
import { Evento } from './Evento';

/**
 * Interface que representa um processo jurídico
 */
export interface Processo {
  id?: string;
  numero?: string;
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  dataConclusao?: string;
  status?: StatusProcesso;
  advogadoId?: string;
  advogadoNome?: string;
  clienteId?: string;
  clienteNome?: string;
  concluido?: boolean;
  mensagensNaoLidas?: number;
  prazosVencidos?: number;
  isDraft?: boolean;
}

/**
 * DTO para resposta da API de processos
 */
export interface ProcessoDTO {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusProcesso;
  tipoProcesso: TipoProcesso;
  urgencia: "BAIXA" | "MEDIA" | "ALTA";
  dataAbertura: string;
  cliente: ClienteDTO;
  advogado: AdvogadoDTO;
  linhaDoTempo: StatusUpdateDTO[];
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO simplificado para cliente
 */
export interface ClienteDTO {
  id: number;
  nome: string;
  email: string;
}

/**
 * DTO simplificado para advogado
 */
export interface AdvogadoDTO {
  id: number;
  nome: string;
  email: string;
  oab: string;
}

/**
 * DTO para atualização de status
 */
export interface StatusUpdateDTO {
  id: number;
  statusAnterior: StatusProcesso;
  novoStatus: StatusProcesso;
  descricao: string;
  dataAtualizacao: string;
}

/**
 * Interface para processo do cliente
 */
export interface ProcessoCliente extends Omit<ProcessoDTO, 'linhaDoTempo' | 'id'> {
  id: string;
  situacaoAtual: StatusProcesso;
  dataSolicitacao: string;
  urgencia: "BAIXA" | "MEDIA" | "ALTA";
  timeline: TimelineEntry[];
  objetivos: string;
  documentosDisponiveis?: string;
  documentosAnexados: any[];
  motivoRejeicao?: string;
  eventos?: Evento[];
}

/**
 * Interface para processo do advogado
 */
export interface ProcessoAdvogado extends Omit<ProcessoDTO, 'linhaDoTempo' | 'id'> {
  id: string;
  situacaoAtual: StatusProcesso;
  dataSolicitacao: string;
  dataAceite: string;
  advogado: AdvogadoDTO;
  urgencia: "BAIXA" | "MEDIA" | "ALTA";
  timeline: TimelineEntry[];
  objetivos: string;
  documentosDisponiveis?: string;
  documentosAnexados: any[];
  motivoRejeicao?: string;
  eventos?: Evento[];
}

/**
 * Entrada do timeline
 */
export interface TimelineEntry {
  id: string;
  data: string;
  statusAnterior?: StatusProcesso;
  novoStatus: StatusProcesso;
  descricao: string;
  autor: "cliente" | "advogado" | "sistema";
  observacoes?: string;
}

/**
 * Enumeração com os possíveis status de um processo
 */
export enum ProcessoStatus {
  RASCUNHO = 'RASCUNHO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  AGUARDANDO_DADOS = 'AGUARDANDO_DADOS',
  EM_JULGAMENTO = 'EM_JULGAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  ARQUIVADO = 'ARQUIVADO'
} 