import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { TICKET_ROUTES } from '@/lib/api-routes';
import { connect, disconnect, sendMessage } from '@/services/ticketChatService';

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
  ticketId: number;
  mensagem: string;
  clienteId?: number;
  advogadoId?: number;
  anexos?: string[];
}

export const useMensagens = (ticketId?: string) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();
  const isConnectedRef = useRef(false);

  const fetchMensagens = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(TICKET_ROUTES.MESSAGES(id)) as { data: { data: Mensagem[] } };
      setMensagens(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar mensagens';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMensagem = async (id: string, data: CreateMensagemData) => {
    setIsLoading(true);
    try {
      // Send via WebSocket
      sendMessage(id, data);
      // Note: The message will be received via WebSocket and added to state there
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar mensagem';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageReceived = (message: any) => {
    // Transform the message to match the Mensagem interface
    const newMessage: Mensagem = {
      id: message.id,
      conteudo: message.mensagem || message.conteudo,
      dataHora: message.dataHora,
      clienteId: message.cliente?.id || message.clienteId,
      clienteNome: message.cliente?.nome || message.clienteNome,
      advogadoId: message.advogado?.id || message.advogadoId,
      advogadoNome: message.advogado?.nome || message.advogadoNome,
    };
    setMensagens(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (ticketId && !isConnectedRef.current) {
      connect(ticketId, handleMessageReceived);
      isConnectedRef.current = true;
    }

    return () => {
      if (isConnectedRef.current) {
        disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [ticketId]);

  return {
    mensagens,
    isLoading,
    fetchMensagens,
    sendMensagem,
  };
};