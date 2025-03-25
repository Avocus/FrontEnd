/**
 * Interface que representa um prazo processual
 */
export interface Prazo {
  id?: string;
  titulo: string;
  descricao?: string;
  dataInicio: string | Date;
  dataFim: string | Date;
  status?: PrazoStatus;
  processoId?: string;
  numeroProcesso?: string;
  advogadoId?: string;
  advogadoNome?: string;
  clienteId?: string;
  clienteNome?: string;
  prioridade?: PrazoPrioridade;
}

/**
 * Enumeração com os status de prazo
 */
export enum PrazoStatus {
  PENDENTE = 'PENDENTE',
  CONCLUIDO = 'CONCLUIDO',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO'
}

/**
 * Enumeração com as prioridades de prazo
 */
export enum PrazoPrioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
} 