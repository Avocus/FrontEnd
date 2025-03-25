/**
 * Interface que representa uma mensagem de chat
 */
export interface Mensagem {
  id?: string;
  conteudo: string;
  dataHora: string | Date;
  lida: boolean;
  remetente: string;
  remetenteId: string;
  remetenteNome?: string;
  destinatario?: string;
  destinatarioId?: string;
  processoId?: string;
  arquivos?: Arquivo[];
}

/**
 * Interface para representar um anexo/arquivo de mensagem
 */
export interface Arquivo {
  id?: string;
  nome: string;
  url?: string;
  tipo: string;
  tamanho?: number;
  mensagemId?: string;
}

/**
 * Interface para representar uma conversa/chat
 */
export interface Chat {
  id?: string;
  processoId?: string;
  numeroProcesso?: string;
  advogadoId?: string;
  nomeAdvogado?: string;
  clienteId?: string;
  nomeCliente?: string;
  ultimaMensagem?: string | Date;
  mensagensNaoLidas?: number;
  mensagens?: Mensagem[];
} 