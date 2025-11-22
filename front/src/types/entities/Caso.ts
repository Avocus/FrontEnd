/**
 * Interfaces relacionadas a casos jurídicos
 */

import { TipoProcesso, StatusProcesso } from '@/types/enums';

/**
 * Interface para documentos anexados a um caso
 */
export interface DocumentoAnexado {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataEnvio: string;
  conteudo: string; // Base64 do arquivo
}

/**
 * Interface para entradas do timeline de um caso
 */
export interface TimelineEntry {
  id: string;
  data: string;
  statusAnterior?: string;
  novoStatus: string;
  descricao: string;
  autor: "cliente" | "advogado" | "sistema";
  observacoes?: string;
}

/**
 * Interface para casos visualizados pelo cliente
 */
export interface CasoCliente {
  id: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  status: StatusProcesso;
  advogadoId?: string;
  advogadoNome?: string;
  documentosAnexados?: DocumentoAnexado[];
  timeline?: TimelineEntry[];
  motivoRejeicao?: string;
}

/**
 * Interface para casos visualizados pelo advogado
 */
export interface CasoAdvogado {
  id: string;
  casoClienteId: string;
  advogadoId: string;
  advogadoNome: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  dataAceite: string;
  status: StatusProcesso;
  documentosAnexados?: DocumentoAnexado[];
  timeline?: TimelineEntry[];
  motivoRejeicao?: string;
}