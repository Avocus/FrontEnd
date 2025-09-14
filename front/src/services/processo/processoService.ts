import api from '@/lib/api';
import { ProcessoDTO } from '@/types/entities/Processo';
import { StatusProcesso, TipoProcesso } from '@/types/enums';

export interface CriarProcessoRequest {
  clienteId: string;
  tipoProcesso: string;
  titulo: string;
  descricao: string;
  status: string;
}

export const criarProcesso = async (processoData: CriarProcessoRequest): Promise<ProcessoDTO> => {
  try {
    const response = await api.post('/processo', processoData);
    const responseData = response.data as { data?: ProcessoDTO };

    if (!responseData.data) {
      throw new Error('Resposta inválida do servidor');
    }

    return responseData.data;
  } catch (error) {
    console.error('Erro ao criar processo:', error);
    throw error;
  }
};

export const listarProcessos = async (): Promise<ProcessoDTO[]> => {
  try {
    const response = await api.get('/processo');
    const responseData = response.data as { data?: ProcessoDTO[] };

    return responseData.data || [];
  } catch (error) {
    console.error('Erro ao listar processos:', error);
    throw error;
  }
};

export const buscarProcessoPorId = async (id: string): Promise<ProcessoDTO> => {
  try {
    const response = await api.get(`/processo/${id}`);
    const responseData = response.data as { data?: ProcessoDTO };

    if (!responseData.data) {
      throw new Error('Processo não encontrado');
    }

    return responseData.data;
  } catch (error) {
    console.error('Erro ao buscar processo:', error);
    throw error;
  }
};