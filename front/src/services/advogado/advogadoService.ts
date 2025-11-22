/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api';
import { ClienteLista } from '@/types/entities/Cliente';

export const getAdvogadoProfile = async (): Promise<any> => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil do advogado:', error);
    throw error;
  }
};

export const getMeusClientes = async (): Promise<ClienteLista[]> => {
  try {
    const response = await api.get('/advogado/meus-clientes');
    const responseData = response.data as { data?: ClienteLista[] };

    return responseData.data || [];
  } catch (error) {
    console.error('Erro ao obter lista de clientes:', error);
    throw error;
  }
};

export const vincularCliente = async (email: string): Promise<void> => {
  try {
    await api.post('/advogado/vincular-cliente', null, {
      params: { email }
    });
  } catch (error) {
    console.error('Erro ao vincular cliente:', error);
    throw error;
  }
};

export const gerarLinkConvite = async (): Promise<string> => {
  try {
    const response = await api.get('/advogado/gerar-link-convite');
    const responseData = response.data as { data?: string };

    return responseData.data || '';
  } catch (error) {
    console.error('Erro ao gerar link de convite:', error);
    throw error;
  }
};

export const validarTokenConvite = async (token: string): Promise<any> => {
  try {
    const response = await api.post('/advogado/validar-token-convite', null, {
      params: { token }
    });
    const responseData = response.data as { data?: any };

    return responseData.data;
  } catch (error) {
    console.error('Erro ao validar token de convite:', error);
    throw error;
  }
};
