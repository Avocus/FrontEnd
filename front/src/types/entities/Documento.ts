/**
 * Interface que representa um documento do processo
 */
export interface DocumentoProcesso {
  id: string;
  processoId: string;
  clienteId: string;
  nomeArquivo: string;
  nomeOriginal: string;
  tipoConteudo: string;
  tamanhoBytes: number;
  caminhoS3: string;
  bucket: string;
  descricao?: string;
  enviadoPorAdvogado: boolean;
  visualizado: boolean;
  dadoRequisitadoId?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentoData {
  processoId: string;
  clienteId: number;
  dadoRequisitadoId?: string;
  descricao?: string;
  enviadoPorAdvogado: boolean;
}

export interface DocumentoState {
  documentos: DocumentoProcesso[];
  documentosPorProcesso: Record<string, DocumentoProcesso[]>;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  
  loadDocumentos: (processoId: string, clienteId?: number) => Promise<void>;
  uploadDocumento: (file: File, data: UploadDocumentoData) => Promise<void>;
  downloadDocumento: (documentoId: string, nomeOriginal: string) => Promise<void>;
  deleteDocumento: (documentoId: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Interface que representa um documento (biblioteca)
 */
export interface Documento {
  id?: string;
  nome: string;
  descricao?: string;
  url?: string;
  tipo: string;
  tamanho?: number;
  dataCriacao?: string | Date;
  dataAtualizacao?: string | Date;
  processoId?: string;
  usuarioId?: string;
  categorias?: string[];
}

/**
 * Interface que representa um material jurídico (biblioteca)
 */
export interface MaterialJuridico {
  id?: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  url?: string;
  categorias?: string[];
  dataCriacao?: string | Date;
  autor?: string;
  visualizacoes?: number;
} 