import api from '@/lib/api';
// não precisa importar axios aqui — vamos fazer verificação defensiva do objeto de erro

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
    // Verificação defensiva para evitar erros de tipagem — quando há response com status
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { status?: number; data?: unknown } };
      const status = err.response?.status;
      const serverData = err.response?.data as unknown;
      type ServerError = { message?: string };
      const serverMessage = (serverData && typeof serverData === 'object') ? (serverData as ServerError).message : undefined;
      if (status === 401) {
        throw new Error(serverMessage ?? 'Credenciais inválidas');
      }
      console.error('Erro ao fazer login (response):', err);
      // throw new Error(serverMessage ?? 'Erro ao conectar ao servidor');
    }

    console.error('Erro ao fazer login:', error);
    throw new Error('Erro ao conectar ao servidor');
  }
};