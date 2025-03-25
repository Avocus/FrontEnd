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
  status?: ProcessoStatus;
  advogadoId?: string;
  advogadoNome?: string;
  clienteId?: string;
  clienteNome?: string;
  concluido?: boolean;
  mensagensNaoLidas?: number;
  prazosVencidos?: number;
}

/**
 * Enumeração com os possíveis status de um processo
 */
export enum ProcessoStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  AGUARDANDO = 'AGUARDANDO'
} 