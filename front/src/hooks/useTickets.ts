import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { TICKET_ROUTES } from '@/lib/api-routes';

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  tipoProcesso: string;
  status: string;
  clienteId: number;
  clienteNome: string;
  advogadoResponsavelId?: number;
  advogadoResponsavelNome?: string;
  dataSolicitacao: string;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(TICKET_ROUTES.LIST) as { data: { data: Ticket[] } };
      setTickets(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar tickets';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(TICKET_ROUTES.DETAIL(id)) as { data: { data: Ticket } };
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar detalhes do ticket';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignTicket = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.put(TICKET_ROUTES.ASSIGN(id)) as { data: { data: Ticket } };
      setTickets(prev => prev.map(t => t.id === parseInt(id) ? response.data.data : t));
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atribuir ticket';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeTicket = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.put(TICKET_ROUTES.COMPLETE(id)) as { data: { data: Ticket } };
      setTickets(prev => prev.map(t => t.id === parseInt(id) ? response.data.data : t));
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao concluir ticket';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignedTickets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(TICKET_ROUTES.ASSIGNED) as { data: { data: Ticket[] } };
      setTickets(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar tickets atribuídos';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProcess = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(TICKET_ROUTES.GENERATE_PROCESS(id)) as { data: { data: number } };
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao gerar processo';
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tickets,
    isLoading,
    fetchTickets,
    fetchTicketDetail,
    assignTicket,
    completeTicket,
    fetchAssignedTickets,
    generateProcess,
  };
};