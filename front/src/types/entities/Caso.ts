/**
 * Interfaces relacionadas a processos jurídicos
 */

import { TipoProcesso, StatusProcesso } from '@/types/enums';
import { Evento } from './Evento';
import { ClienteDTO, AdvogadoDTO } from './Processo';

/**
 * Interface para documentos anexados a um processo
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
 * Interface para entradas do timeline de um processo
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
 * Interface base para processos
 */
export interface ProcessoBase {
  id: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "BAIXA" | "MEDIA" | "ALTA";
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
 * Interface para processos visualizados pelo cliente
 */
export interface ProcessoCliente extends ProcessoBase {
  advogado?: AdvogadoDTO;
}

/**
 * Interface para processos visualizados pelo advogado
 */
export interface ProcessoAdvogado extends ProcessoBase {
  dataAceite: string;
  advogado: AdvogadoDTO;
}