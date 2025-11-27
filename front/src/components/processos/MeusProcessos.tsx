"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store"
import { useLayout } from "@/contexts/LayoutContext"
import { TipoProcesso, StatusProcesso, getStatusProcessoLabel } from "@/types/enums"
import { getStatusColor, getStatusIcon, getColumnColor } from "@/utils/processoUtils"

import { 
  Briefcase, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Eye,
  Calendar,
  FileText,
  Search,
  Play,
  HelpCircle,
  List,
  Grid,
  Pause,
  X,
  Check,
  Send,
  FileCheck,
  Gavel,
  Archive
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProcessoStore } from "@/store"
import { getUrgenciaStyles } from "@/lib/urgency"
import LoadingScreen from "../common/LoadingScreen"
import { StatusBadge } from "./shared/StatusBadge"

export default function MeusProcessos() {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const router = useRouter()
  
  // Usar a store Zustand em vez de estado local
  const { processosCliente, processosAdvogado, carregarProcessosCliente, carregarProcessosAdvogado } = useProcessoStore()
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(() => {
    const allStatuses = new Set(Object.values(StatusProcesso))
    allStatuses.delete(StatusProcesso.CONCLUIDO)
    allStatuses.delete(StatusProcesso.ARQUIVADO)
    allStatuses.delete(StatusProcesso.REJEITADO)
    allStatuses.delete(StatusProcesso.ACEITO)
    return allStatuses
  })

  const carregarProcessos = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      if (isAdvogado) {
        await carregarProcessosAdvogado()
      } else {
        await carregarProcessosCliente()
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar processos:", error)
      setIsLoading(false)
    }
  }, [user, isAdvogado, carregarProcessosCliente, carregarProcessosAdvogado])

  useEffect(() => {
    carregarProcessos()
  }, [carregarProcessos])

  // Filtrar processos baseado no tipo de usuário e termo de busca
  const processos = isAdvogado ? processosAdvogado : processosCliente
  const filteredProcessos = processos.filter(processo =>
    processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (isAdvogado ? processo.cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  )

  const getTipoProcessoLabel = (tipo: TipoProcesso) => {
    const labels: Record<TipoProcesso, string> = {
      [TipoProcesso.CIVIL]: "Civil",
      [TipoProcesso.PENAL]: "Penal", 
      [TipoProcesso.TRABALHISTA]: "Trabalhista",
      [TipoProcesso.ADMINISTRATIVO]: "Administrativo",
      [TipoProcesso.CONSUMIDOR]: "Direito do Consumidor",
      [TipoProcesso.FAMILIAR]: "Direito de Família",
      [TipoProcesso.PREVIDENCIARIO]: "Previdenciário",
      [TipoProcesso.OUTROS]: "Outros"
    }
    return labels[tipo] || tipo
  }

  // agora usamos os estilos centralizados de urgência

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleNovoProcesso = () => {
    router.push('/processos/novo')
  }

  const handleVerDetalhes = (processoId: string) => {
    router.push(`/processos/${processoId}`);
  }

  // Funções para Kanban
  const getKanbanColumns = () => {
    const allColumns = Object.values(StatusProcesso).map(status => ({
      key: status,
      title: getStatusProcessoLabel(status),
      status: status,
      color: getColumnColor(status)
    }))

    const selectedColumns = allColumns.filter(col => selectedStatuses.has(col.status))

    return selectedColumns.map(col => ({
      ...col,
      processos: filteredProcessos.filter(processo => processo.status === col.status)
    }))
  }

  if (isLoading) {
    return (
        <LoadingScreen />
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Meus Processos</h1>
          </div>
          <div className="flex gap-3">
            {/* Toggle de visualização */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
            {viewMode === "kanban" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Filtrar Colunas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Status para exibir</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedStatuses(new Set(Object.values(StatusProcesso)))}>
                    Selecionar Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatuses(new Set())}>
                    Desmarcar Todos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {Object.values(StatusProcesso).map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.has(status)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedStatuses)
                        if (checked) {
                          newSelected.add(status)
                        } else {
                          newSelected.delete(status)
                        }
                        setSelectedStatuses(newSelected)
                      }}
                    >
                      {getStatusProcessoLabel(status)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button 
              onClick={handleNovoProcesso}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </div>
        </div>

        {/* Filtro de busca */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isAdvogado ? "Buscar por título do processo ou nome do cliente..." : "Buscar por título do processo..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === "list" ? (
          /* Visão Lista */
          <>
            {filteredProcessos.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Nenhum processo encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Nenhum processo corresponde à sua busca." : "Você ainda não solicitou nenhum processo jurídico. Comece agora mesmo!"}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={handleNovoProcesso}                  
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Solicitar Primeiro Processo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProcessos.map((processo) => (
                  <Card key={processo.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold mb-2">
                            {processo.titulo}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {getTipoProcessoLabel(processo.tipoProcesso)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatarData(processo.dataSolicitacao)}
                            </div>
                            <div className={cn("flex items-center gap-1 font-medium", getUrgenciaStyles(processo.urgencia).text)}>
                              <AlertCircle className="h-4 w-4" />
                              Urgência {processo.urgencia}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={processo.status} isAdvogado={isAdvogado} />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {processo.descricao}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Processo #{processo.id.slice(-6)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerDetalhes(processo.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Visão Kanban */
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4">
              {getKanbanColumns().map((column) => (
                <div key={column.key} className={cn("rounded-lg border-2 p-4 flex-1 min-w-32", column.color)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.processos.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {column.processos.map((processo) => (
                      <Card key={processo.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVerDetalhes(processo.id)}>
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{processo.titulo}</h4>
                          <div className="text-xs text-muted-foreground mb-2">
                            {isAdvogado ? processo.cliente.nome : getTipoProcessoLabel(processo.tipoProcesso)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className={cn("text-xs font-medium", getUrgenciaStyles(processo.urgencia).text)}>
                              {processo.urgencia}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatarData(processo.dataSolicitacao)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {column.processos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhum processo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer com estatísticas - só mostrar na visão lista */}
        {viewMode === "list" && filteredProcessos.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {filteredProcessos.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Processos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredProcessos.filter(c => c.status === StatusProcesso.RASCUNHO).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rascunhos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {filteredProcessos.filter(c => c.status === StatusProcesso.EM_ANDAMENTO).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Em Andamento</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {filteredProcessos.filter(c => c.status === StatusProcesso.CONCLUIDO).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Concluídos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}