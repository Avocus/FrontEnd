import api from '@/lib/api';
import { DadoRequisitado, CriarDadoRequisitadoData } from '@/types/entities/DadoRequisitado';

export const dadoRequisitadoService = {
  async criar(data: CriarDadoRequisitadoData): Promise<{ data: DadoRequisitado }> {
    // Mapear para o formato esperado pelo backend
    const payload = {
      processoId: Number(data.processoId),
      nomeDado: data.descricao,
      tipo: data.tipo,
      responsavel: data.responsabilidade,
      observacao: data.observacoes,
    };
    const response = await api.post<{ data: DadoRequisitado }>('/dado-requisitado', payload);
    return response.data;
  },

  async listar(processoId: string): Promise<{ data: DadoRequisitado[] }> {
    const response = await api.get<{ data: DadoRequisitado[] }>(`/dado-requisitado/processo/${processoId}`);
    return response.data;
  },
};
