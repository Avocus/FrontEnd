'use client'

import React, { useEffect, useState } from 'react';
import { useTickets, Ticket } from '@/hooks/useTickets';
import { useMensagens } from '@/hooks/useMensagens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MensagemList from './MensagemList';
import MensagemInput from './MensagemInput';
import { useRouter } from 'next/navigation';
import { getStatusTicketLabel } from '@/types/enums';
import { useAuthStore } from '@/store';
import { useLayout } from "@/contexts/LayoutContext";

interface TicketDetailProps {
  ticketId: string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId }) => {
  const { fetchTicketDetail, assignTicket, completeTicket, generateProcess, isLoading } = useTickets();
  const { mensagens, fetchMensagens, sendMensagem } = useMensagens(ticketId);
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const { user } = useAuthStore();
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
      // Primeiro enviar uma mensagem automática como advogado informando a criação
      const mensagemAutomatica =
        'Iniciamos um processo jurídico através deste ticket por favor navegue até a aba Meus Casos, para ver mais detalhes Ass. Avocuss';

      // Envia a mensagem e só prossegue se for enviada com sucesso
      await handleSendMessage(mensagemAutomatica);

      const processoId = await generateProcess(ticketId);
      // Redirecionar para o processo recém-criado
      router.push(`/processos/${processoId}`);
    } catch (error) {
      console.error('Erro ao gerar processo ou enviar mensagem:', error);
    }
  };

  const handleSendMessage = async (conteudo: string) => {
    const messageData = {
      ticketId: parseInt(ticketId),
      mensagem: conteudo,
      ...(isAdvogado ? { advogadoId: parseInt(user?.id || '0') } : { clienteId: parseInt(user?.id || '0') })
    };

    // Deixe o erro propagar para que o chamador saiba se falhou
    await sendMensagem(ticketId, messageData);
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
            <Badge variant={ticket.status === 'PENDENTE' ? 'secondary' : ticket.status === 'ASSIGNED' ? 'default' : 'outline'}>
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
              <Button onClick={handleAssign} disabled={isLoading} variant={"primary"}>
                Pegar Ticket
              </Button>
            )}
            {canComplete && (
              <Button onClick={handleComplete} disabled={isLoading} variant={"secondary"}>
                Marcar como Concluído
              </Button>
            )}
            {canGenerateProcess && (
              <Button onClick={handleGenerateProcess} disabled={isLoading} variant={"primary"}>
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
          <div className="flex flex-col h-64">
            <div className="flex-1 overflow-y-auto px-1 py-2 space-y-2" style={{ background: 'transparent' }}>
              <MensagemList mensagens={mensagens} currentUserId={user?.id} currentUserName={user?.nome} isAdvogado={isAdvogado} />
            </div>

            <div className="mt-2 pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
              <MensagemInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetail;