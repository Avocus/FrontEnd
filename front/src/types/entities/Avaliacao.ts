/**
 * Interface que representa uma avaliação
 */
export interface Avaliacao {
  id?: string;
  nota: number;
  comentario?: string;
  dataAvaliacao: string | Date;
  statusModeracao?: StatusModeracao;
  motivoRejeicao?: string;
  advogadoId?: string;
  nomeAdvogado?: string;
  clienteId?: string;
  nomeCliente?: string;
  processoId?: string;
  numeroProcesso?: string;
}

/**
 * Enumeração com os status de moderação de avaliações
 */
export enum StatusModeracao {
  APROVADO = 'APROVADO',
  PENDENTE = 'PENDENTE',
  REJEITADO = 'REJEITADO'
} 