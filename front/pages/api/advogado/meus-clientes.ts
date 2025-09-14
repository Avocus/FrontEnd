import type { NextApiRequest, NextApiResponse } from 'next';
import { ADVOGADO_ROUTES } from '../../../lib/api-routes';
import { ClienteLista } from '../../../src/types/entities/Cliente';

type ResponseData = {
  success: boolean;
  data?: ClienteLista[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const response = await fetch(ADVOGADO_ROUTES.MEUS_CLIENTES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `Erro na requisição: ${response.status}`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    return res.status(200).json({ success: true, data: responseData.data });
  } catch (error: Error | unknown) {
    console.error('Erro ao buscar clientes:', error);

    const errorMessage = (error as Error)?.message || 'Erro ao buscar clientes';

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}