import { BaseProfile } from './Profile';

export interface ClienteProfile extends BaseProfile {
  cpf: string;
  profissao?: string;
  empresa?: string;
  observacoes?: string;
  estadoCivil?: string;
  genero?: string;
}

export interface PerfilCliente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  dataNascimento: string;
  fotoPerfil?: string;
  processosAtivos: number;
  processosFinalizados: number;
}

export interface ClienteLista {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  status: boolean;
  dataNascimento: string;
  processosAtivos?: number;
} 