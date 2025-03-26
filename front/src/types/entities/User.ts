import { Role } from './Role';

/**
 * Interface que representa um usuário do sistema
 */
export interface User {
  id?: string;
  nome?: string;
  email?: string;
  roles?: Role[];
  client?: boolean;
  token?: string;
  foto?: string;
  isAtivo?: boolean;
  ultimoAcesso?: string;
}

/**
 * Interface que representa as credenciais de login
 */
export interface Credentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Resposta da API de autenticação
 */
export interface UserResponse {
  id: string;
  nome: string;
  email: string;
  roles: Role[];
  token: string;
}

/**
 * Resposta genérica da API para usuários
 */
export interface UserApiResponse {
  data: UserResponse;
}

/**
 * Interface para dados de cadastro de usuário
 */
export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
} 