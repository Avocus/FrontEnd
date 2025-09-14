"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PlusCircle, 
  Trash2, 
  Clock, 
  MapPin, 
  Mail,
  AlertTriangle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Filter,
  X,
  Bell
} from "lucide-react"
import { useAgendaStore } from "@/store/useAgendaStore"
import { TimePicker } from "@/components/ui/time-picker"
import { Evento, EventoTipo, EventoStatus, EventoCor } from "@/types"
import { useEffect, useState } from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNotificacoes } from "@/hooks/useNotificacoes"
import '@/styles/agenda.css'
import { useLayout } from "@/contexts/LayoutContext"

// Componente seletor de cores
function ColorPicker({ value, onChange }: { value: EventoCor, onChange: (cor: EventoCor) => void }) {
    const { updateConfig, isAdvogado } = useLayout();
    
    useEffect(() => {
      updateConfig({
        showNavbar: true,
        showSidebar: true,
        showFooter: true
      });
    }, [updateConfig, isAdvogado]);
  
  
  const cores = Object.values(EventoCor)
  
  return (
    <div className="flex flex-wrap gap-2">
      {cores.map((cor) => (
        <button
          key={cor}
          type="button"
          className={`w-8 h-8 rounded-full border-2 ${
            value === cor ? 'border-gray-800 scale-110' : 'border-gray-300'
          } transition-all hover:scale-105`}
          style={{ backgroundColor: cor }}
          onClick={() => onChange(cor)}
        />
      ))}
    </div>
  )
}

// Componente card de evento
function EventoCard({ evento, onEdit, onDelete }: { 
  evento: Evento, 
  onEdit: (evento: Evento) => void,
  onDelete: (id: string) => void 
}) {
  const dataEvento = new Date(evento.dataInicio)
  const dataFim = evento.dataFim ? new Date(evento.dataFim) : null
  
  const getStatusIcon = () => {
    switch (evento.status) {
      case EventoStatus.CONFIRMADO:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case EventoStatus.PENDENTE:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case EventoStatus.CANCELADO:
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusClass = () => {
    let classes = "evento-card"
    
    if (isPast(dataEvento)) classes += " evento-passado"
    if (isToday(dataEvento)) classes += " evento-hoje"
    if (isTomorrow(dataEvento)) classes += " evento-amanha"
    
    // Adicionar classe baseada no tipo
    switch (evento.tipo) {
      case EventoTipo.AUDIENCIA:
        classes += " evento-audiencia"
        break
      case EventoTipo.REUNIAO:
        classes += " evento-reuniao"
        break
      case EventoTipo.PRAZO:
        classes += " evento-prazo"
        break
      default:
        classes += " evento-outro"
    }
    
    return classes
  }

  return (
    <div
      className={`p-4 border rounded-lg bg-card hover:bg-accent/50 transition-all cursor-pointer ${getStatusClass()}`}
      style={{ borderLeftColor: evento.cor, borderLeftWidth: '4px' }}
      onClick={() => onEdit(evento)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground">{evento.titulo}</h3>
            {getStatusIcon()}
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{format(dataEvento, "HH:mm", { locale: ptBR })}</span>
              {dataFim && (
                <span>até {format(dataFim, "HH:mm", { locale: ptBR })}</span>
              )}
            </div>
            
            {evento.localizacao && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{evento.localizacao}</span>
              </div>
            )}
            
            {evento.notificarPorEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className={evento.emailNotificado ? "text-green-600" : "text-blue-600"}>
                  {evento.emailNotificado ? "E-mail enviado" : "Notificar por e-mail"}
                </span>
              </div>
            )}
          </div>
          
          {evento.descricao && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {evento.descricao}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Badge variant="outline">{evento.tipo}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(evento.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AgendaCompleta() {
  const [date, setDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null)
  
  // Campos do formulário
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())
  const [selectedEndTime, setSelectedEndTime] = useState<Date | undefined>(undefined)
  const [tipo, setTipo] = useState<EventoTipo>(EventoTipo.OUTRO)
  const [status, setStatus] = useState<EventoStatus>(EventoStatus.PENDENTE)
  const [cor, setCor] = useState<EventoCor>(EventoCor.AZUL)
  const [localizacao, setLocalizacao] = useState("")
  const [notificarPorEmail, setNotificarPorEmail] = useState(true)
  const [lembrarAntes, setLembrarAntes] = useState(1440) // 24 horas
  
  const {
    eventos,
    addEvento,
    updateEvento,
    removeEvento,
    getEventosByDate,
    getEventosProximos,
    getEventosPassados,
    loadEventos
  } = useAgendaStore()

  const selectedDateEvents = getEventosByDate(date)
  const eventosProximos = getEventosProximos(7)
  const eventosPassados = getEventosPassados(7)

  // Hook para notificações
  const { verificarNotificacoes } = useNotificacoes()

  useEffect(() => {
    loadEventos()
  }, [loadEventos])

  const resetForm = () => {
    setTitulo("")
    setDescricao("")
    setSelectedTime(new Date())
    setSelectedEndTime(undefined)
    setTipo(EventoTipo.OUTRO)
    setStatus(EventoStatus.PENDENTE)
    setCor(EventoCor.AZUL)
    setLocalizacao("")
    setNotificarPorEmail(true)
    setLembrarAntes(1440)
    setEventoEditando(null)
  }

  const handleOpenDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditEvento = (evento: Evento) => {
    setEventoEditando(evento)
    setTitulo(evento.titulo)
    setDescricao(evento.descricao || "")
    setSelectedTime(new Date(evento.dataInicio))
    setSelectedEndTime(evento.dataFim ? new Date(evento.dataFim) : undefined)
    setTipo(evento.tipo)
    setStatus(evento.status || EventoStatus.PENDENTE)
    setCor(evento.cor)
    setLocalizacao(evento.localizacao || "")
    setNotificarPorEmail(evento.notificarPorEmail ?? true)
    setLembrarAntes(evento.lembrarAntes || 1440)
    setIsDialogOpen(true)
  }

  const handleSaveEvent = async () => {
    if (!titulo.trim()) return

    const eventDate = new Date(date)
    eventDate.setHours(selectedTime.getHours())
    eventDate.setMinutes(selectedTime.getMinutes())
    
    let dataFim: string | undefined
    if (selectedEndTime) {
      const endDate = new Date(date)
      endDate.setHours(selectedEndTime.getHours())
      endDate.setMinutes(selectedEndTime.getMinutes())
      dataFim = endDate.toISOString()
    }

    const eventoData = {
      titulo,
      descricao: descricao || undefined,
      dataInicio: eventDate.toISOString(),
      dataFim,
      tipo,
      status,
      cor,
      localizacao: localizacao || undefined,
      notificarPorEmail,
      lembrarAntes,
      emailNotificado: false
    }

    try {
      if (eventoEditando) {
        await updateEvento(eventoEditando.id, eventoData)
      } else {
        await addEvento(eventoData)
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await removeEvento(id)
    } catch (error) {
      console.error('Erro ao remover evento:', error)
    }
  }

  const isEventOnDate = (eventDate: string, date: Date) => {
    const eventDateTime = new Date(eventDate)
    return (
      eventDateTime.getDate() === date.getDate() &&
      eventDateTime.getMonth() === date.getMonth() &&
      eventDateTime.getFullYear() === date.getFullYear()
    )
  }

  return (
    <div className="container mx-auto p-4 lg:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Agenda Completa</h1>
        <div className="flex gap-2">
          <Button 
            onClick={verificarNotificacoes} 
            variant="outline" 
            size="sm"
            title="Verificar e enviar notificações pendentes"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificar
          </Button>
          <Button onClick={handleOpenDialog} variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendario" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="proximos">
            Próximos ({eventosProximos.length})
          </TabsTrigger>
          <TabsTrigger value="passados">
            Passados ({eventosPassados.length})
          </TabsTrigger>
          <TabsTrigger value="todos">Todos ({eventos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-6">
          <div className="grid lg:grid-cols-[400px_1fr] gap-6">
            {/* Calendário */}
            <div className="rounded-md border shadow bg-card p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="w-full"
                modifiers={{
                  hasEvent: (date) =>
                    eventos.some((event) => isEventOnDate(event.dataInicio, date)),
                  today: (date) => isToday(date),
                  tomorrow: (date) => isTomorrow(date)
                }}
                modifiersClassNames={{
                  hasEvent: "has-event",
                  today: "bg-blue-100 text-blue-900 font-bold",
                  tomorrow: "bg-yellow-100 text-yellow-900"
                }}
              />
            </div>

            {/* Eventos do dia selecionado */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </h3>
                <Badge variant={isToday(date) ? "default" : "outline"}>
                  {selectedDateEvents.length} eventos
                </Badge>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents
                    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
                    .map((evento) => (
                      <EventoCard
                        key={evento.id}
                        evento={evento}
                        onEdit={handleEditEvento}
                        onDelete={handleDeleteEvent}
                      />
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum evento para esta data</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleOpenDialog}
                    >
                      Adicionar evento
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proximos" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-medium">Próximos Eventos</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {eventosProximos.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onEdit={handleEditEvento}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="passados" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Eventos Passados</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {eventosPassados.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onEdit={handleEditEvento}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="todos" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Todos os Eventos</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventos
              .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime())
              .map((evento) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  onEdit={handleEditEvento}
                  onDelete={handleDeleteEvent}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para adicionar/editar evento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {eventoEditando ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título do evento"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição detalhada do evento"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as EventoTipo)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventoTipo.AUDIENCIA}>Audiência</SelectItem>
                    <SelectItem value={EventoTipo.REUNIAO}>Reunião</SelectItem>
                    <SelectItem value={EventoTipo.PRAZO}>Prazo</SelectItem>
                    <SelectItem value={EventoTipo.OUTRO}>Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as EventoStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventoStatus.PENDENTE}>Pendente</SelectItem>
                    <SelectItem value={EventoStatus.CONFIRMADO}>Confirmado</SelectItem>
                    <SelectItem value={EventoStatus.CONCLUIDO}>Concluído</SelectItem>
                    <SelectItem value={EventoStatus.CANCELADO}>Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Cor do Evento</Label>
              <ColorPicker value={cor} onChange={setCor} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Horário de Início</Label>
                <TimePicker date={selectedTime} setDate={setSelectedTime} />
              </div>

              <div className="grid gap-2">
                <Label>Horário de Fim (opcional)</Label>
                <TimePicker 
                  date={selectedEndTime || new Date()} 
                  setDate={setSelectedEndTime}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="localizacao">Local</Label>
              <Input
                id="localizacao"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Local do evento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Lembrar antes (minutos)</Label>
                <Select 
                  value={lembrarAntes.toString()} 
                  onValueChange={(value) => setLembrarAntes(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="240">4 horas</SelectItem>
                    <SelectItem value="1440">1 dia</SelectItem>
                    <SelectItem value="2880">2 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="notificar-email"
                  checked={notificarPorEmail}
                  onChange={(e) => setNotificarPorEmail(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="notificar-email" className="text-sm">
                  Notificar por e-mail
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveEvent} disabled={!titulo.trim()}>
              {eventoEditando ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
