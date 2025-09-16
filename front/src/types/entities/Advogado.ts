export interface PerfilAdvogado {
  nome: string;
  email: string;
  telefone: string;
  oab: string;
  endereco: string;
  cidade: string;
  estado: string;
  especialidades?: string[];
  areasAtuacao?: string[];
  avaliacao?: number;
  fotoPerfil?: string;
  clientesAtivos: number;
  processosAtivos: number;
}

export interface AdvogadoLista {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  oab?: string;
  status: 'ativo' | 'pendente' | 'inativo';
  dataCadastro: string;
  especialidades?: string[];
  avaliacao?: number;
}