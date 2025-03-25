import { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROUTES, ResponseContent } from '../../../lib/api-routes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apenas permite método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];

    const backendResponse = await fetch(USER_ROUTES.PROFILE_INCOMPLETE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      console.error('Erro ao conectar com o backend:', error);
      return null;
    });
    
    if (!backendResponse) {
      return res.status(500).json({ 
        error: 'Erro de conexão com o servidor' 
      });
    }
    
    if (!backendResponse.ok) {
      return res.status(backendResponse.status || 500).json({ 
        error: 'Erro ao verificar status do perfil' 
      });
    }
    
    const responseData: ResponseContent<boolean> = await backendResponse.json();
    
    return res.status(200).json(responseData.data);
    
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 