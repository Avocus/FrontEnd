import { getToken } from "@/utils/authUtils";
import { PerfilCliente } from "@/types/entities/Cliente";

/**
 * Verifica se o perfil do usuário está completo
 * @returns Boolean indicando se o perfil está completo (true = completo, false = incompleto)
 */
export const checkProfileStatus = async (): Promise<boolean> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await fetch('/api/profile/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Erro ao verificar status do perfil');
    }
  
    // A API já retorna diretamente o boolean
    return response.json();
  } catch (error) {
    console.error('Erro ao verificar status do perfil:', error);
    throw error;
  }
};

/**
 * Busca os dados gerais do perfil do cliente para exibição
 * Este método obtém os dados do endpoint de dados-gerais do backend
 * @returns Dados do perfil do cliente formatados para exibição na UI
 */
export const getProfileData = async (): Promise<PerfilCliente> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await fetch('/api/profile/dados-gerais', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao carregar dados do perfil');
    }
    
    const responseData = await response.json();
    
    // Retorna os dados da resposta
    return responseData.data as PerfilCliente;
  } catch (error) {
    console.error('Erro ao obter dados do perfil:', error);
    throw new Error('Não foi possível carregar os dados do perfil');
  }
}; 