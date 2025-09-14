/**
 * Rotas da API externa
 * Este arquivo não deve ser importado pelo lado do cliente
 */

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces para tipagem de respostas da API
export interface ApiErrorResponse {
  error: string;
}

export interface UserResponse {
  jwt: string;
  name: string;
  client: boolean;
}

export interface UserApiResponse {
  data: UserResponse;
}

export interface ResponseContent<T> {
  data: T;
  errors?: string[];
  message?: string;
}

// Rotas de autenticação
export const AUTH_ROUTES = {
  LOGIN: `${API_BASE_URL}/user/login`,
  REGISTER: `${API_BASE_URL}/user/registrar`,
};

// Rotas de usuários
export const USER_ROUTES = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  PROFILE_INCOMPLETE: `${API_BASE_URL}/user/perfil-pendente`,
  PROFILE_GENERAL_DATA: `${API_BASE_URL}/user/dados-gerais`,
};

// Rotas de advogados
export const ADVOGADO_ROUTES = {
  MEUS_CLIENTES: `${API_BASE_URL}/advogado/meus-clientes`,
};


// Adicione outras categorias de rotas conforme necessário 