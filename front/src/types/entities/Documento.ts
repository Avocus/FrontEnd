/**
 * Interface que representa um documento
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