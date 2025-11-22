// Exemplo de como usar a AgendaCompleta em uma página

import { useState } from 'react'
import { AgendaCompleta } from '@/components/agenda/AgendaCompleta'
import { Calendar } from "@/components/ui/calendar"
import { useAgendaStore } from "@/store/useAgendaStore"
import { ptBR } from "date-fns/locale"

// Página completa da agenda
export function AgendaPage() {
  return (
    <div className="min-h-screen bg-background">
      <AgendaCompleta />
    </div>
  )
}

// Para usar como parte de um dashboard
export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Outros widgets do dashboard */}
      <div className="lg:col-span-2">
        <AgendaCompleta />
      </div>
      
      {/* Sidebar com outras informações */}
      <div className="space-y-6">
        {/* Outros componentes */}
      </div>
    </div>
  )
}

// Para usar apenas o calendário sem todas as abas
export function CalendarioSimples() {
  const { eventos } = useAgendaStore()
  const [date, setDate] = useState<Date>(new Date())
  
  const isEventOnDate = (eventDate: string, date: Date) => {
    const eventDateTime = new Date(eventDate)
    return (
      eventDateTime.getDate() === date.getDate() &&
      eventDateTime.getMonth() === date.getMonth() &&
      eventDateTime.getFullYear() === date.getFullYear()
    )
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && setDate(newDate)}
      locale={ptBR}
      modifiers={{
        hasEvent: (date) =>
          eventos.some((event) => isEventOnDate(event.dataInicio, date)),
      }}
      modifiersClassNames={{
        hasEvent: "has-event",
      }}
    />
  )
}
