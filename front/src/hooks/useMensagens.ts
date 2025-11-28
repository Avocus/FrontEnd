import { useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { TICKET_ROUTES } from '@/lib/api-routes';

export interface Mensagem {
  id: number;
  conteudo: string;
  dataHora: string;
  clienteId?: number;
  clienteNome?: string;
  advogadoId?: number;
  advogadoNome?: string;
}

export interface CreateMensagemData {
  conteudo: string;
}

export const useMensagens = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchMensagens = async (ticketId: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(TICKET_ROUTES.MESSAGES(ticketId)) as { data: { data: Mensagem[] } };
      setMensagens(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar mensagens';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMensagem = async (ticketId: string, data: CreateMensagemData) => {
    setIsLoading(true);
    try {
      const response = await api.post(TICKET_ROUTES.MESSAGES(ticketId), data) as { data: { data: Mensagem } };
      setMensagens(prev => [...prev, response.data.data]);
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar mensagem';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mensagens,
    isLoading,
    fetchMensagens,
    sendMensagem,
  };
};