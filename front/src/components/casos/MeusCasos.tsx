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
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CasoCliente {
  id: string
  clienteId: string
  clienteNome: string
  titulo: string
  tipoProcesso: TipoProcesso
  descricao: string
  situacaoAtual: string
  objetivos: string
  urgencia: "baixa" | "media" | "alta"
  documentosDisponiveis?: string
  dataSolicitacao: string
  status: "pendente" | "em_analise" | "aceito" | "rejeitado"
}

export default function MeusCasos() {
  const { user } = useAuthStore()
  const { info } = useToast()
  const router = useRouter()
  const [casos, setCasos] = useState<CasoCliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const carregarCasos = useCallback(() => {
    if (!user) return

    try {
      const casosExistentes = JSON.parse(localStorage.getItem("casoCliente") || "[]")
      
      // Filtrar casos do cliente logado
      const casosDoCliente = casosExistentes.filter(
        (caso: CasoCliente) => caso.clienteId === user.client?.toString()
      )
      
      setCasos(casosDoCliente)
    } catch (error) {
      console.error("Erro ao carregar casos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    carregarCasos()
  }, [carregarCasos])

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
      rejeitado: "bg-red-100 text-red-800 border-red-200"
    }
    return colors[status]
  }

  const getStatusIcon = (status: CasoCliente["status"]) => {
    const icons = {
      pendente: <Clock className="h-3 w-3" />,
      em_analise: <Eye className="h-3 w-3" />,
      aceito: <CheckCircle2 className="h-3 w-3" />,
      rejeitado: <AlertCircle className="h-3 w-3" />
    }
    return icons[status]
  }

  const getStatusLabel = (status: CasoCliente["status"]) => {
    const labels = {
      pendente: "Pendente",
      em_analise: "Em Análise",
      aceito: "Aceito",
      rejeitado: "Rejeitado"
    }
    return labels[status]
  }

  const getUrgenciaColor = (urgencia: CasoCliente["urgencia"]) => {
    const colors = {
      baixa: "text-green-600",
      media: "text-yellow-600",
      alta: "text-red-600"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Meus Casos</h1>
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
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum caso encontrado
              </h3>
              <p className="text-gray-500 mb-6">
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
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {caso.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
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
                  <div className="text-2xl font-bold text-blue-600">
                    {casos.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Casos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {casos.filter(c => c.status === 'pendente').length}
                  </div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {casos.filter(c => c.status === 'em_analise').length}
                  </div>
                  <div className="text-sm text-gray-600">Em Análise</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {casos.filter(c => c.status === 'aceito').length}
                  </div>
                  <div className="text-sm text-gray-600">Aceitos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}