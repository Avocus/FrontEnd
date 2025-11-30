import api from '@/lib/api';
import { ProcessoDTO } from '@/types/entities/Processo';
import { PROCESSO_ROUTES } from '@/lib/api-routes';

export interface CriarProcessoRequest {
  clienteId: string;
  advogadoId?: string;
  tipoProcesso: string;
  titulo: string;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: string;
  documentosDisponiveis?: string;
  status: string;
}

export interface ProcessoDisponivel extends ProcessoDTO {
  clienteNome: string;
}

export interface AtribuirAdvogadoRequest {
  advogadoId: string;
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
    const response = await api.get(PROCESSO_ROUTES.DETAIL(id));
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

export const listarProcessosDisponiveis = async (): Promise<ProcessoDisponivel[]> => {
  try {
    const response = await api.get(PROCESSO_ROUTES.DISPONIVEIS);
    const responseData = response.data as { data?: ProcessoDisponivel[] };

    return responseData.data || [];
  } catch (error) {
    console.error('Erro ao listar processos disponíveis:', error);
    throw error;
  }
};

export const atribuirAdvogadoProcesso = async (processoId: string, advogadoId: string): Promise<ProcessoDTO> => {
  try {
    const response = await api.put(PROCESSO_ROUTES.ASSIGN(processoId), {
      advogadoId
    });
    const responseData = response.data as { data?: ProcessoDTO };

    if (!responseData.data) {
      throw new Error('Resposta inválida do servidor');
    }

    return responseData.data;
  } catch (error) {
    console.error('Erro ao atribuir advogado ao processo:', error);
    throw error;
  }
};