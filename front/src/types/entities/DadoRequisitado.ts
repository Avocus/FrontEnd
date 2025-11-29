export enum TipoDado {
  DOCUMENTO = 'DOCUMENTO',
  INFORMACAO = 'INFORMACAO'
}

export enum ResponsabilidadeDocumento {
  CLIENTE = 'CLIENTE',
  ADVOGADO = 'ADVOGADO',
  AMBOS = 'AMBOS'
}

export interface DadoRequisitado {
  id: string | number;
  processoId: string | number;
  nomeDado: string;
  tipo: TipoDado;
  responsavel: ResponsabilidadeDocumento;
  enviado: boolean;
  dataEnvio?: string;
  observacao?: string;
  documento?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Aliases para compatibilidade com UI
export interface DadoRequisitadoUI extends DadoRequisitado {
  descricao: string;
  responsabilidade: ResponsabilidadeDocumento;
  observacoes?: string;
  dataCriacao?: string;
  prazoEntrega?: string;
}

export interface CriarDadoRequisitadoData {
  processoId: string;
  clienteId: number;
  tipo: TipoDado;
  descricao: string;
  responsabilidade: ResponsabilidadeDocumento;
  prazoEntrega?: string;
  observacoes?: string;
}

export interface DadoRequisitadoState {
  dadosRequisitados: DadoRequisitado[];
  dadosPorProcesso: Record<string, DadoRequisitado[]>;
  isLoading: boolean;
  error: string | null;
  
  loadDadosRequisitados: (processoId: string) => Promise<void>;
  criarSolicitacao: (data: CriarDadoRequisitadoData) => Promise<void>;
  clearError: () => void;
}
