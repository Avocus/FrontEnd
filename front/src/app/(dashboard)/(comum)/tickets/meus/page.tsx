'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store'
import api from '@/lib/api'
import { TipoProcesso, getTipoProcessoLabel, getStatusTicketLabel } from '@/types/enums'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ResponseContent } from '@/types/api/responses'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Ticket {
  id: number
  titulo: string
  descricao: string
  tipoProcesso: TipoProcesso
  status: string
  dataSolicitacao: string
  clienteNome: string
  advogadoNome?: string
}

export default function MeusTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const endpoint = user?.client === false ? '/ticket/assigned' : '/ticket'
      const response = await api.get<ResponseContent<Ticket[]>>(endpoint)
      setTickets(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar tickets:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {user?.client === false ? 'Meus Tickets Atribuídos' : 'Meus Tickets'}
        </h1>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {user?.client === false 
                  ? 'Você ainda não pegou nenhum ticket.' 
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
                        {getTipoProcessoLabel(ticket.tipoProcesso)}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusTicketLabel(ticket.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{format(new Date(ticket.dataSolicitacao), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    {ticket.advogadoNome && (
                      <p>Advogado: {ticket.advogadoNome}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{ticket.descricao}</p>
                <div className="flex justify-end">
                  <Link href={`/tickets/${ticket.id}`}>
                    <Button variant={"primary"}>Ver Detalhes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}