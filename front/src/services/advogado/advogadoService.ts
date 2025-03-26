import { getToken } from '@/utils/authUtils';

interface AdvogadoProfile {
  id: string;
  nome: string;
  oab: string;
  especialidades: string[];
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  descricao: string;
  fotoPerfil?: string;
}

/**
 * Obtém o perfil completo do advogado logado
 */
export const getAdvogadoProfile = async (): Promise<AdvogadoProfile> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch('/api/user/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter perfil do advogado');
  }

  return response.json();
};
