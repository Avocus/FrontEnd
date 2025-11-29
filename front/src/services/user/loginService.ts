import api from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: number;
  jwt: string;
  name: string;
  client: boolean;
}

export const loginUsuario = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post('/user/login', {
      username: credentials.email,
      password: credentials.password,
    });
    const responseData = response.data as { data: LoginResponse };
    return responseData.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      throw new Error('Credenciais inválidas');
    }
    console.error('Erro ao fazer login:', error);
    throw new Error('Erro ao conectar ao servidor');
  }
};