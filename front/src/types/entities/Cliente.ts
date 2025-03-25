import { BaseProfile } from './Profile';

/**
 * Interface que representa o perfil de um cliente
 */
export interface ClienteProfile extends BaseProfile {
  cpf: string;
  profissao?: string;
  empresa?: string;
  observacoes?: string;
  estadoCivil?: string;
  genero?: string;
}

/**
 * Interface que representa o perfil do cliente na UI
 * Utilizada para exibição de dados no componente DadosUsuario
 */
export interface PerfilCliente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  dataNascimento: string;
  fotoPerfil: string;
  processosAtivos: number;
  processosFinalizados: number;
}

/**
 * Interface que representa os dados de cadastro de um cliente
 */
export interface ClienteCadastro {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  telefone?: string;
  dataNascimento?: string;
  termos: boolean;
} 