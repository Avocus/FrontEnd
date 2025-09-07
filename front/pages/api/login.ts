// pages/api/logar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_ROUTES, UserApiResponse, ApiErrorResponse, UserResponse } from '../../lib/api-routes';

// Interfaces para tipagem
interface LoginCredentials {
  username: string;
  password: string;
}

// Função para autenticação pelo servidor
async function serverLogin(email: string, password: string): Promise<UserResponse> {
  try {
    const credentials: LoginCredentials = { username: email, password };
    
    const response = await fetch(AUTH_ROUTES.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const responseData: UserApiResponse | ApiErrorResponse = await response.json() as UserApiResponse | ApiErrorResponse;

    if(response.status == 401)
      throw new Error('Credenciais inválidas');

    if ('error' in responseData) {
      throw new Error(responseData.error);
    }
    
    return responseData.data;
  } catch (error) {
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { method, email, password } = req.body;

  try {

    let result = await serverLogin(email, password);

    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro no backend:', error);
      res.status(400).json({ error: error.message });
    } else {
      console.error('Erro desconhecido no backend:', error);
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
}