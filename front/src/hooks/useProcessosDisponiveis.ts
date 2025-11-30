import { useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { PROCESSO_ROUTES } from '@/lib/api-routes';
import { ProcessoDTO } from '@/types/entities/Processo';
import { useAuthStore } from '@/store';

export interface ProcessoDisponivel extends ProcessoDTO {
  clienteNome: string;
}

export const useProcessosDisponiveis = () => {
  const [processos, setProcessos] = useState<ProcessoDisponivel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError, success } = useToast();
  const { user } = useAuthStore();

  const fetchProcessosDisponiveis = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(PROCESSO_ROUTES.DISPONIVEIS) as { data: { data: ProcessoDisponivel[] } };
      setProcessos(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar processos disponíveis';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const assignProcesso = async (id: string) => {
    if (!user?.id) {
      showError('Usuário não identificado');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(PROCESSO_ROUTES.ASSIGN(id), {
        advogadoId: user.id
      }) as { data: { data: ProcessoDisponivel } };

      // Remove o processo da lista de disponíveis
      setProcessos(prev => prev.filter(p => p.id !== parseInt(id)));
      success('Processo atribuído com sucesso!');
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atribuir processo';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processos,
    isLoading,
    fetchProcessosDisponiveis,
    assignProcesso,
  };
};