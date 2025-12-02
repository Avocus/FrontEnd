import api from '@/lib/api';
import { AdvogadoLista } from '@/types/entities/Advogado';

export const getMeusAdvogados = async (): Promise<AdvogadoLista[]> => {
  try {
    const response = await api.get('/cliente/meus-advogados');
    const responseData = response.data as { data?: AdvogadoLista[] };

    return responseData.data || [];
  } catch (error) {
    console.error('Erro ao obter lista de advogados:', error);
    throw error;
  }
};

export const getPerfilAdvogado = async (advogadoId: string) => {
  try {
    const response = await api.get(`/cliente/advogado/${advogadoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil do advogado:', error);
    throw error;
  }
};


export const getNumeroDocumentosPendentes = async (): Promise<number> => {
  try {
    const response = await api.get('/cliente/documentos-pendentes');
    const responseData = response.data as { count: number };
    return responseData.count;
  } catch (error) {
    console.error('Erro ao obter número de documentos pendentes:', error);
    throw error;
  } 
};