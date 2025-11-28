'use client'

import React, { useEffect, useState } from 'react';
import { useTickets, Ticket } from '@/hooks/useTickets';
import { useMensagens, Mensagem } from '@/hooks/useMensagens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MensagemList from './MensagemList';
import MensagemInput from './MensagemInput';
import { useRouter } from 'next/navigation';
import { getStatusTicketLabel } from '@/types/enums';
import { useLayout } from "@/contexts/LayoutContext";

interface TicketDetailProps {
  ticketId: string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId }) => {
  const { fetchTicketDetail, assignTicket, completeTicket, generateProcess, isLoading } = useTickets();
  const { mensagens, fetchMensagens, sendMensagem } = useMensagens();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const { isAdvogado } = useLayout();

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const ticketData = await fetchTicketDetail(ticketId);
        setTicket(ticketData);
        await fetchMensagens(ticketId);
      } catch (error) {
        console.error('Erro ao carregar ticket:', error);
      }
    };
    loadTicket();
  }, [ticketId]);

  const handleAssign = async () => {
    try {
      const updatedTicket = await assignTicket(ticketId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Erro ao atribuir ticket:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const updatedTicket = await completeTicket(ticketId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Erro ao concluir ticket:', error);
    }
  };

  const handleGenerateProcess = async () => {
    try {
      const processoId = await generateProcess(ticketId);
      // Redirecionar para o processo recém-criado
      router.push(`/processos/${processoId}`);
    } catch (error) {
      console.error('Erro ao gerar processo:', error);
    }
  };

  const handleSendMessage = async (conteudo: string) => {
    try {
      await sendMensagem(ticketId, { conteudo });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (!ticket) {
    return <div>Carregando...</div>;
  }

  const canAssign = isAdvogado && ticket.status === 'PENDING';
  const canComplete = !isAdvogado && ticket.status === 'ASSIGNED';
  const canGenerateProcess = isAdvogado && ticket.status === 'ASSIGNED';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ticket.titulo}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={ticket.status === 'PENDING' ? 'secondary' : ticket.status === 'ASSIGNED' ? 'default' : 'outline'}>
              {getStatusTicketLabel(ticket.status)}
            </Badge>
            <span className="text-sm text-gray-500">
              Cliente: {ticket.clienteNome}
            </span>
            {ticket.advogadoResponsavelNome && (
              <span className="text-sm text-gray-500">
                Advogado: {ticket.advogadoResponsavelNome}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{ticket.descricao}</p>
          <div className="flex gap-2">
            {canAssign && (
              <Button onClick={handleAssign} disabled={isLoading}>
                Pegar Ticket
              </Button>
            )}
            {canComplete && (
              <Button onClick={handleComplete} disabled={isLoading}>
                Marcar como Concluído
              </Button>
            )}
            {canGenerateProcess && (
              <Button onClick={handleGenerateProcess} disabled={isLoading}>
                Gerar Processo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <MensagemList mensagens={mensagens} />
          <MensagemInput onSend={handleSendMessage} disabled={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetail;