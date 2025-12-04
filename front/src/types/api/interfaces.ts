// API Interfaces

export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiRegisterCredentials {
  name: string;
  client: boolean;
  username: string;
  password: string;
  inviteToken: string;
}

export interface EmailRequest {
  para: string;
  titulo: string;
  dataEvento: string;
  descricao?: string;
  localizacao?: string;
}