/**
 * Interfaces relacionadas a casos jurídicos
 */

import { TipoProcesso, StatusProcesso } from '@/types/enums';
import { Evento } from './Evento';
import { ClienteDTO, AdvogadoDTO } from './Processo';

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
 * Interface base para casos
 */
export interface CasoBase {
  id: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  status: StatusProcesso;
  cliente: ClienteDTO;
  advogado?: AdvogadoDTO;
  documentosAnexados?: DocumentoAnexado[];
  timeline?: TimelineEntry[];
  eventos?: Evento[];
  motivoRejeicao?: string;
}

/**
 * Interface para casos visualizados pelo cliente
 */
export interface CasoCliente extends CasoBase {
  advogado?: AdvogadoDTO;
}

/**
 * Interface para casos visualizados pelo advogado
 */
export interface CasoAdvogado extends CasoBase {
  dataAceite: string;
  advogado: AdvogadoDTO;
}