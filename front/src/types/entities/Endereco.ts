/**
 * Interface que representa um endereço
 */
export interface Endereco {
  id?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal?: boolean;
  usuarioId?: string;
} 