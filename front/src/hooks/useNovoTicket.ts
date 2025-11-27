import { useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';

export interface NovoTicketFormData {
  titulo: string;
  tipoProcesso: string;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: string;
}

export const useNovoTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const onSubmit = async (data: NovoTicketFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        titulo: data.titulo,
        tipoProcesso: data.tipoProcesso,
        descricao: data.descricao,
        situacaoAtual: data.situacaoAtual,
        objetivos: data.objetivos,
        urgencia: data.urgencia,
      };

      const response = await api.post('/ticket', payload);
      success('Ticket criado com sucesso!');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar ticket';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};