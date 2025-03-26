import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROUTES } from '../../../lib/api-routes';

type ProfileData = {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

type ResponseData = {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

/**
 * Endpoint para buscar os dados gerais do perfil do usuário
 * Este endpoint atua como um proxy para o backend principal, 
 * adicionando o token de autenticação e tratando os erros.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  // Obtém o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const response = await fetch(USER_ROUTES.PROFILE_GENERAL_DATA, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.error('Erro ao conectar com o backend:', error);
        return null;
      });
      
    const responseData = await response?.json()

    // Retorna os dados para o frontend
    return res.status(200).json({ success: true, data: responseData.data });
  } catch (error: Error | unknown) {
    console.error('Erro ao buscar dados do perfil:', error);
    
    // Tratamento simplificado de erro
    const status = (error as ApiError)?.response?.status || 500;
    const errorMessage = 
      (error as ApiError)?.response?.data?.message || 
      (error as Error)?.message || 
      'Erro ao buscar dados do perfil';
    
    return res.status(status).json({ 
      success: false, 
      error: String(errorMessage)
    });
  }
} 