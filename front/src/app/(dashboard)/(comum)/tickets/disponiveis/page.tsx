'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store'
import { useTickets } from '@/hooks/useTickets'
import { TipoProcesso, getTipoProcessoLabel, getStatusTicketLabel } from '@/types/enums'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'


export default function TicketsPage() {
  const { tickets, fetchTickets, assignTicket, isLoading } = useTickets()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchTickets()
  }, [])

  const handlePegarTicket = async (ticketId: number) => {
    try {
      await assignTicket(ticketId.toString())
    } catch (error) {
      console.error('Erro ao pegar ticket:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-green-100 text-green-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {user?.client === false ? 'Tickets Disponíveis' : 'Meus Tickets'}
        </h1>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {user?.client === false 
                  ? 'Nenhum ticket disponível no momento.' 
                  : 'Você ainda não criou nenhum ticket.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{ticket.titulo}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getTipoProcessoLabel(ticket.tipoProcesso as TipoProcesso)}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusTicketLabel(ticket.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{format(new Date(ticket.dataSolicitacao), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    <p>Cliente: {ticket.clienteNome}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{ticket.descricao}</p>
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver Detalhes
                  </Link>
                  {ticket.status === 'PENDING' && (
                    <Button
                      onClick={() => handlePegarTicket(ticket.id)}
                      variant={"primary"}
                    >
                      Pegar Caso
                    </Button>
                  )}
                  {ticket.status === 'ASSIGNED' && (
                    <Button variant="outline" disabled>
                      Caso já atribuído
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}