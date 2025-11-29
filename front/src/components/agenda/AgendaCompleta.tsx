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
import { Evento, EventoTipo, EventoStatus, EventoCor, CreateEventoPayload, ValidatedUpdateEventoPayload } from "@/types"
import { useEffect, useState } from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNotificacoes } from "@/hooks/useNotificacoes"
import { ModalBuscaProcesso } from "@/components/processos/ModalBuscaProcesso"
import { ProcessoDTO } from "@/types/entities/Processo"
import '@/styles/agenda.css'
import { useLayout } from "@/contexts/LayoutContext"

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
          className={`relative w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
            value === cor 
              ? 'border-gray-800 scale-110 ring-2 ring-gray-800 ring-offset-1' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ backgroundColor: cor }}
          onClick={() => onChange(cor)}
          title={`Cor: ${cor}`}
        >
          {value === cor && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white drop-shadow-sm" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

// Componente card de evento será definido dentro do componente principal


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
  const [local, setLocal] = useState("")
  const [notificarPorEmail, setNotificarPorEmail] = useState(true)
  const [lembrarAntes, setLembrarAntes] = useState(1440) // 24 horas
  const [clienteSelecionado, setClienteSelecionado] = useState<{id: number | string, nome: string} | null>(null)
  const [processoSelecionado, setProcessoSelecionado] = useState<{id: number, titulo: string} | null>(null)
  const [error, setError] = useState<string>("")
  
  // Estados para modais de busca
  const [showProcessoModal, setShowProcessoModal] = useState(false)
  
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

  const { isAdvogado } = useLayout()

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
    setLocal("")
    setNotificarPorEmail(true)
    setLembrarAntes(1440)
    setClienteSelecionado(null)
    setProcessoSelecionado(null)
    setEventoEditando(null)
    setError("")
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
    setCor(evento.cor as EventoCor)
    setLocal(evento.local || "")
    setNotificarPorEmail(evento.notificarPorEmail ?? true)
    setLembrarAntes(evento.diasLembrarAntes || 1440)
    setClienteSelecionado(evento.cliente ? {id: evento.cliente.id, nome: evento.cliente.nome} : null)
    setProcessoSelecionado(evento.processo ? {id: evento.processo.id, titulo: evento.processo.titulo} : null)
    setIsDialogOpen(true)
  }

  const handleProcessoSelect = (processo: ProcessoDTO) => {
    setProcessoSelecionado({ id: processo.id, titulo: processo.titulo })
    // Vincular automaticamente o cliente do processo
    if (processo.cliente) {
      setClienteSelecionado({ id: processo.cliente.id, nome: processo.cliente.nome })
    }
    setShowProcessoModal(false)
  }

  const handleSaveEvent = async () => {
    if (!titulo.trim()) return

    if (selectedEndTime) {
      const start = new Date(date)
      start.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0)
      const end = new Date(date)
      end.setHours(selectedEndTime.getHours(), selectedEndTime.getMinutes(), 0, 0)
      if (end <= start) {
        setError("O horário de término deve ser posterior ao horário de início.")
        return
      }
    }
    setError("")

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

    const eventoData: CreateEventoPayload = {
      titulo,
      descricao: descricao || "",
      dataInicio: eventDate.toISOString(),
      dataFim: dataFim || "",
      tipo,
      status,
      cor,
      local: local || "",
      diasLembrarAntes: lembrarAntes,
      notificarPorEmail
    }

    let eventoDataComRelacionamentos: ValidatedUpdateEventoPayload

    if (processoSelecionado?.id) {
      eventoDataComRelacionamentos = {
        ...eventoData,
        clienteId: clienteSelecionado?.id ? Number(clienteSelecionado.id) : (() => {
          throw new Error('Cliente é obrigatório quando processo está selecionado')
        })(),
        processoId: processoSelecionado.id
      }
    } else {
      eventoDataComRelacionamentos = {
        ...eventoData,
        clienteId: undefined,
        processoId: undefined
      }
    }

    try {
      if (eventoEditando) {
        await updateEvento(eventoEditando.id, eventoDataComRelacionamentos)
      } else {
        await addEvento(eventoDataComRelacionamentos)
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    }
  }

  const handleDeleteEvent = async (id: number) => {
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

  // Componente card de evento
  function EventoCard({ evento, onEdit, onDelete }: {
    evento: Evento,
    onEdit: (evento: Evento) => void,
    onDelete: (id: number) => void
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
        onClick={() => isAdvogado && onEdit(evento)}
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
              
              {evento.local && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{evento.local}</span>
                </div>
              )}
              
              {evento.notificarPorEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="text-blue-600">
                    Notificar por e-mail
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
            {isAdvogado && (
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
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Agenda Completa</h1>
        <div className="flex gap-2">
          {isAdvogado && (
            <Button 
              onClick={verificarNotificacoes} 
              variant="outline" 
              size="sm"
              title="Verificar e enviar notificações pendentes"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificar
            </Button>
          )}
          {isAdvogado && (
            <Button onClick={handleOpenDialog} variant="primary" size="sm" className="bg-primary hover:bg-secondary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          )}
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
                locale={ptBR}
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
                    {isAdvogado && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleOpenDialog}
                      >
                        Adicionar evento
                      </Button>
                    )}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {eventoEditando ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
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
                <Label>Tipo *</Label>
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
                <Label>Status *</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as EventoStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventoStatus.PENDENTE}>Pendente</SelectItem>
                    <SelectItem value={EventoStatus.CONFIRMADO}>Confirmado</SelectItem>
                    <SelectItem value={EventoStatus.CANCELADO}>Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Cor do Evento</Label>
              <ColorPicker value={cor} onChange={setCor} />
            </div>

            <div className="grid gap-2">
              <Label>Cliente (vinculado ao processo)</Label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 border rounded-md bg-muted/50">
                  {clienteSelecionado ? clienteSelecionado.nome : "Selecione um processo primeiro"}
                </div>
                {clienteSelecionado && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setClienteSelecionado(null)
                      setProcessoSelecionado(null)
                    }}
                    title="Limpar seleção"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {clienteSelecionado && (
                <p className="text-sm text-muted-foreground">
                  Cliente vinculado automaticamente ao processo selecionado
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Processo (opcional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProcessoModal(true)}
                  className="flex-1 justify-start"
                >
                  {processoSelecionado ? processoSelecionado.titulo : "Selecionar processo"}
                </Button>
                {processoSelecionado && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setProcessoSelecionado(null)
                      setClienteSelecionado(null)
                    }}
                    title="Limpar seleção"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {!processoSelecionado && (
                <p className="text-sm text-muted-foreground">
                  Ao selecionar um processo, o cliente será vinculado automaticamente
                </p>
              )}
              {processoSelecionado && (
                <p className="text-sm text-muted-foreground">
                  Processo selecionado: {processoSelecionado.titulo}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Horário de Início *</Label>
                <TimePicker date={selectedTime} setDate={setSelectedTime} />
              </div>

              <div className="grid gap-2">
                <Label>Horário de Término (opcional)</Label>
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
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Local do evento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Lembrar antes (minutos) *</Label>
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
            <Button onClick={handleSaveEvent} disabled={!titulo.trim()} variant="primary" size="sm" className="bg-primary hover:bg-secondary">
              {eventoEditando ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de busca de processo */}
      <ModalBuscaProcesso
        isOpen={showProcessoModal}
        onOpenChange={setShowProcessoModal}
        onProcessoSelect={handleProcessoSelect}
      />
    </div>
  )
}
