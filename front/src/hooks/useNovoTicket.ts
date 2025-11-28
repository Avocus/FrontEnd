import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';

export interface NovoTicketFormData {
  titulo: string;
  tipoProcesso: string;
  descricao: string;
}

export const useNovoTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();
  const router = useRouter();

  const onSubmit = async (data: NovoTicketFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        titulo: data.titulo,
        tipoProcesso: data.tipoProcesso,
        descricao: data.descricao,
      };

      const response = await api.post('/ticket', payload) as { data: { data: any } };
      success('Ticket criado com sucesso!');
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        router.push("/tickets/meus")
      }, 2000)
      
      return response.data.data;
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