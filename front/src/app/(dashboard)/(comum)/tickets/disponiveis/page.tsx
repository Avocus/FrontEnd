'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store'
import api from '@/lib/api'
import { TipoProcesso, getTipoProcessoLabel } from '@/types/enums'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ResponseContent } from '@/types/api/responses'

interface Ticket {
  id: number
  titulo: string
  descricao: string
  tipoProcesso: TipoProcesso
  status: string
  dataSolicitacao: string
  clienteNome: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const response = await api.get<ResponseContent<Ticket[]>>('/ticket')
      setTickets(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePegarTicket = async (ticketId: number) => {
    try {
      await api.put(`/ticket/${ticketId}/pegar`)
      // Recarregar tickets após pegar um
      loadTickets()
    } catch (error) {
      console.error('Erro ao pegar ticket:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      case 'CONVERTED': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Aberto'
      case 'ASSIGNED': return 'Atribuído'
      case 'CLOSED': return 'Fechado'
      case 'CONVERTED': return 'Convertido'
      default: return status
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tickets Disponíveis</h1>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Nenhum ticket disponível no momento.</p>
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
                        {getTipoProcessoLabel(ticket.tipoProcesso)}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
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
                <div className="flex justify-end">
                  {ticket.status === 'OPEN' && (
                    <Button
                      onClick={() => handlePegarTicket(ticket.id)}
                      className="bg-green-600 hover:bg-green-700"
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