"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store"
import { useToast } from "@/hooks/useToast"
import { TipoProcesso } from "@/types/enums"
import { 
  Briefcase, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Eye,
  Calendar,
  FileText,
  Send,
  Search,
  Play,
  FileCheck,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCasoStore } from "@/store"
import { CasoCliente } from "@/types/entities"

export default function MeusCasos() {
  const { user } = useAuthStore()
  const { info } = useToast()
  const router = useRouter()
  
  // Usar a store Zustand em vez de estado local
  const { casosCliente, carregarCasosCliente } = useCasoStore()
  const [isLoading, setIsLoading] = useState(true)

  const carregarCasos = useCallback(() => {
    if (!user) return

    try {
      // Carregar casos usando a store
      carregarCasosCliente()
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar casos:", error)
      setIsLoading(false)
    }
  }, [user, carregarCasosCliente])

  useEffect(() => {
    carregarCasos()
  }, [carregarCasos])

  // Filtrar casos do cliente logado da store
  const casos = casosCliente.filter(
    (caso) => caso.clienteId === user?.client?.toString()
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

  const getStatusColor = (status: CasoCliente["status"]) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      em_analise: "bg-blue-100 text-blue-800 border-blue-200",
      aceito: "bg-green-100 text-green-800 border-green-200",
      rejeitado: "bg-red-100 text-red-800 border-red-200",
      aguardando_documentos: "bg-orange-100 text-orange-800 border-orange-200",
      documentos_enviados: "bg-purple-100 text-purple-800 border-purple-200",
      aguardando_analise_documentos: "bg-indigo-100 text-indigo-800 border-indigo-200",
      em_andamento: "bg-cyan-100 text-cyan-800 border-cyan-200",
      protocolado: "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusIcon = (status: CasoCliente["status"]) => {
    const icons = {
      pendente: <Clock className="h-3 w-3" />,
      em_analise: <Eye className="h-3 w-3" />,
      aceito: <CheckCircle2 className="h-3 w-3" />,
      rejeitado: <AlertCircle className="h-3 w-3" />,
      aguardando_documentos: <FileText className="h-3 w-3" />,
      documentos_enviados: <Send className="h-3 w-3" />,
      aguardando_analise_documentos: <Search className="h-3 w-3" />,
      em_andamento: <Play className="h-3 w-3" />,
      protocolado: <FileCheck className="h-3 w-3" />
    }
    return icons[status] || <HelpCircle className="h-3 w-3" />
  }

  const getStatusLabel = (status: CasoCliente["status"]) => {
    const labels = {
      pendente: "Pendente",
      em_analise: "Em Análise",
      aceito: "Aceito",
      rejeitado: "Rejeitado",
      aguardando_documentos: "Aguardando Documentos",
      documentos_enviados: "Documentos Enviados",
      aguardando_analise_documentos: "Aguardando Análise",
      em_andamento: "Em Andamento",
      protocolado: "Protocolado"
    }
    return labels[status] || status
  }

  const getUrgenciaColor = (urgencia: CasoCliente["urgencia"]) => {
    const colors = {
      baixa: "text-green-600 dark:text-green-400",
      media: "text-yellow-600 dark:text-yellow-400",
      alta: "text-red-600 dark:text-red-400"
    }
    return colors[urgencia]
  }

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleNovoCaso = () => {
    router.push('/casos/novo')
  }

  const handleVerDetalhes = (casoId: string) => {
    info(`Visualizando detalhes do caso ${casoId}`)
  }

  if (isLoading) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Meus Casos</h1>
          </div>
          <Button 
            onClick={handleNovoCaso}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Caso
          </Button>
        </div>

        {/* Lista de Casos */}
        {casos.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Nenhum caso encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não solicitou nenhum caso jurídico. Comece agora mesmo!
              </p>
              <Button 
                onClick={handleNovoCaso}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Primeiro Caso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {casos.map((caso) => (
              <Card key={caso.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        {caso.titulo}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {getTipoProcessoLabel(caso.tipoProcesso)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatarData(caso.dataSolicitacao)}
                        </div>
                        <div className={cn("flex items-center gap-1 font-medium", getUrgenciaColor(caso.urgencia))}>
                          <AlertCircle className="h-4 w-4" />
                          Urgência {caso.urgencia}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={cn("flex items-center gap-1", getStatusColor(caso.status))}
                    >
                      {getStatusIcon(caso.status)}
                      {getStatusLabel(caso.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {caso.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Caso #{caso.id.slice(-6)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerDetalhes(caso.id)}
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

        {/* Footer com estatísticas */}
        {casos.length > 0 && (
          <Card className="mt-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {casos.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Casos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {casos.filter(c => c.status === 'pendente').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {casos.filter(c => c.status === 'em_analise').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Em Análise</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {casos.filter(c => c.status === 'aceito').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Aceitos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}