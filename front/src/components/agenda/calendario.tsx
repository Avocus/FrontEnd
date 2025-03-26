"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAgendaStore } from "@/store/useAgendaStore"
import { TimePicker } from "@/components/ui/time-picker"
import { Evento, EventoTipo } from "@/types"
import { useEffect } from "react"

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [newEventTitle, setNewEventTitle] = React.useState("")
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(undefined)
  const { eventos, addEvento, removeEvento, getEventosByDate } = useAgendaStore()
  const [selectedDateEvents, setSelectedDateEvents] = React.useState<Evento[]>([])

  useEffect(() => {
    setDate(new Date())
    setSelectedTime(new Date())
  }, [])

  const handleAddEvent = () => {
    if (date && newEventTitle.trim() && selectedTime) {
      const eventDate = new Date(date)
      eventDate.setHours(selectedTime.getHours())
      eventDate.setMinutes(selectedTime.getMinutes())
      
      addEvento({
        titulo: newEventTitle,
        dataInicio: eventDate.toISOString(),
        tipo: EventoTipo.OUTRO
      })
      setNewEventTitle("")
      setSelectedTime(new Date())
      updateSelectedDateEvents(date)
    }
  }

  const handleRemoveEvent = (id: string) => {
    removeEvento(id)
    if (date) {
      updateSelectedDateEvents(date)
    }
  }

  const updateSelectedDateEvents = React.useCallback((selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const events = getEventosByDate(selectedDate);
    setSelectedDateEvents(events);
  }, [getEventosByDate]);

  React.useEffect(() => {
    updateSelectedDateEvents(date);
  }, [date, updateSelectedDateEvents]);

  const isEventOnDate = (eventDate: string, date: Date) => {
    const eventDateTime = new Date(eventDate)
    return (
      eventDateTime.getDate() === date.getDate() &&
      eventDateTime.getMonth() === date.getMonth() &&
      eventDateTime.getFullYear() === date.getFullYear()
    )
  }

  if (!date || !selectedTime) {
    return null
  }

  return (
    <div className="container mx-auto p-4 lg:py-8">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Agenda</h1>
      <div className="grid lg:grid-cols-[400px_1fr] gap-4 lg:gap-8">
        <div className="rounded-md border shadow bg-card p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full"
            modifiers={{
              hasEvent: (date) =>
                eventos.some((event) => isEventOnDate(event.dataInicio, date)),
            }}
            modifiersClassNames={{
              hasEvent: "has-event",
            }}
          />
        </div>

        <div className="flex flex-col rounded-md border p-4 lg:p-6 shadow bg-card">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-sm lg:text-xl font-medium text-foreground">
              {date ? date.toLocaleDateString() : "Selecione uma data"}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="primary">
                  <PlusCircle className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden lg:inline">Novo Evento</span>
                  <span className="lg:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Evento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-title" className="text-sm font-medium text-foreground">Título do Evento</Label>
                    <Input
                      id="event-title"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Digite o título do evento"
                      className="border-input focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-foreground">Data</Label>
                    <p className="text-sm text-muted-foreground">
                      {date ? date.toLocaleDateString() : "Nenhuma data selecionada"}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-foreground">Horário</Label>
                    <TimePicker date={selectedTime} setDate={setSelectedTime} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-input hover:bg-accent hover:text-accent-foreground">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddEvent} variant={"primary"}>Salvar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 lg:space-y-3">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 lg:p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors">
                  <span className="text-sm lg:text-lg text-foreground">{event.titulo}</span>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Badge variant="outline" className="text-xs lg:text-sm border-input text-muted-foreground">
                      {new Date(event.dataInicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 lg:h-9 lg:w-9 hover:bg-destructive/10"
                      onClick={() => handleRemoveEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 lg:h-5 lg:w-5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum evento para esta data.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


