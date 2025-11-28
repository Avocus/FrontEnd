'use client'

import React, { useEffect } from 'react';
import { useTickets, Ticket } from '@/hooks/useTickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getStatusTicketLabel } from '@/types/enums';

const AdvogadoTicketsList: React.FC = () => {
  const { tickets, fetchAssignedTickets, isLoading } = useTickets();

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Meus Tickets Atribuídos</h1>
      {tickets.length === 0 ? (
        <p>Nenhum ticket atribuído.</p>
      ) : (
        tickets.map((ticket: Ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <CardTitle>{ticket.titulo}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={ticket.status === 'PENDING' ? 'secondary' : ticket.status === 'ASSIGNED' ? 'default' : 'outline'}>
                  {getStatusTicketLabel(ticket.status)}
                </Badge>
                <span className="text-sm text-gray-500">
                  Cliente: {ticket.clienteNome}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{ticket.descricao}</p>
              <Link href={`/tickets/${ticket.id}`}>
                <Button>Ver Detalhes</Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdvogadoTicketsList;