import api from '@/lib/api';
import { PerfilCliente } from '@/types/entities/Cliente';

export const checkProfileStatus = async (): Promise<boolean> => {
  try {
    const response = await api.get('/user/perfil-pendente');
    return response.data as boolean;
  } catch (error) {
    console.error('Erro ao verificar status do perfil:', error);
    throw error;
  }
};

export const getProfileData = async (): Promise<PerfilCliente> => {
  try {
    const response = await api.get('/user/dados-gerais');
    const responseData = response.data as { data: PerfilCliente };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao obter dados do perfil:', error);
    throw new Error('Não foi possível carregar os dados do perfil');
  }
};

export const updateProfileData = async (data: Partial<PerfilCliente>): Promise<PerfilCliente> => {
  try {
    const response = await api.put('/user/dados-gerais', data);
    const responseData = response.data as { data: PerfilCliente };
    return responseData.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do perfil:', error);
    throw new Error('Não foi possível atualizar os dados do perfil');
  }
}; 