"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useCasoStore } from "@/store"
import { useToast } from "@/hooks/useToast"
import { TipoProcesso, StatusProcesso } from "@/types/enums"
import { ClienteLista } from "@/types/entities/Cliente"
import { ArrowLeft, FileText, CheckCircle2, User, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ModalBuscaCliente } from "./ModalBuscaCliente"
import { ModalBuscaAdvogado } from "./ModalBuscaAdvogado"
import { useLayout } from "@/contexts/LayoutContext"

// Schema de validação para o formulário
const novoCasoSchema = z.object({
  titulo: z.string()
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  tipoProcesso: z.nativeEnum(TipoProcesso, {
    message: "Selecione um tipo de processo válido"
  }),
  descricao: z.string()
    .min(20, "Descrição deve ter pelo menos 20 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  situacaoAtual: z.string()
    .min(10, "Situação atual deve ter pelo menos 10 caracteres")
    .max(500, "Situação atual deve ter no máximo 500 caracteres"),
  objetivos: z.string()
    .min(10, "Objetivos devem ter pelo menos 10 caracteres")
    .max(500, "Objetivos devem ter no máximo 500 caracteres"),
  urgencia: z.enum(["baixa", "media", "alta"], {
    message: "Selecione um nível de urgência"
  }),
  documentosDisponiveis: z.string().optional(),
})

type NovoCasoFormData = z.infer<typeof novoCasoSchema>

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
  status: StatusProcesso
}

export default function NovoCaso() {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const { success, error: showError } = useToast()
  const router = useRouter()
  const { adicionarCasoCliente, adicionarCasoAdvogado } = useCasoStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showAdvogadoModal, setShowAdvogadoModal] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLista | null>(null)
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState<any | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    getValues,
    reset
  } = useForm<NovoCasoFormData>({
    resolver: zodResolver(novoCasoSchema),
    mode: "onChange",
    defaultValues: {
      titulo: "",
      tipoProcesso: undefined,
      descricao: "",
      situacaoAtual: "",
      objetivos: "",
      urgencia: undefined,
      documentosDisponiveis: "",
    }
  })

  const watchedValues = watch()

  const getFieldValidationClass = (fieldName: keyof NovoCasoFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasError = errors[fieldName]
    
    if (!isTouched) return ""
    
    if (hasError) return "border-red-500 focus:border-red-500"
    return "border-green-500 focus:border-green-500"
  }

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

  const getUrgenciaLabel = (urgencia: "baixa" | "media" | "alta") => {
    const labels = {
      baixa: "Baixa",
      media: "Média", 
      alta: "Alta"
    }
    return labels[urgencia]
  }

  const getUrgenciaColor = (urgencia: "baixa" | "media" | "alta") => {
    const colors = {
      baixa: "text-green-600 bg-green-50 border-green-200",
      media: "text-yellow-600 bg-yellow-50 border-yellow-200",
      alta: "text-red-600 bg-red-50 border-red-200"
    }
    return colors[urgencia]
  }

  const onSubmit = useCallback(async (data: NovoCasoFormData) => {
    if (!user) {
      showError("Usuário não autenticado")
      return
    }

    setIsLoading(true)

    try {
      if (isAdvogado) {
        // Para advogados: criar caso associado ao cliente selecionado
        if (!clienteSelecionado) {
          showError("Selecione um cliente para o caso")
          return
        }

        const novoCaso = {
          id: Date.now().toString(),
          casoClienteId: Date.now().toString(), // Mesmo ID pois é criado diretamente pelo advogado
          clienteId: clienteSelecionado.id.toString(),
          clienteNome: clienteSelecionado.nome,
          advogadoId: user.id || "unknown",
          advogadoNome: user.nome || "Advogado não informado",
          titulo: data.titulo,
          tipoProcesso: data.tipoProcesso,
          descricao: data.descricao,
          situacaoAtual: data.situacaoAtual,
          objetivos: data.objetivos,
          urgencia: data.urgencia,
          documentosDisponiveis: data.documentosDisponiveis,
          dataSolicitacao: new Date().toISOString(),
          dataAceite: new Date().toISOString(), // Aceito automaticamente quando criado pelo advogado
          status: StatusProcesso.PENDENTE
        }

        adicionarCasoAdvogado(novoCaso)
        success("Caso criado com sucesso!")
      } else {
        // Para clientes: criar solicitação de caso
        const novoCaso: CasoCliente = {
          id: Date.now().toString(),
          clienteId: user.client?.toString() || "unknown",
          clienteNome: user.nome || "Nome não informado",
          titulo: data.titulo,
          tipoProcesso: data.tipoProcesso,
          descricao: data.descricao,
          situacaoAtual: data.situacaoAtual,
          objetivos: data.objetivos,
          urgencia: data.urgencia,
          documentosDisponiveis: data.documentosDisponiveis,
          dataSolicitacao: new Date().toISOString(),
          status: StatusProcesso.PENDENTE
        }

        adicionarCasoCliente(novoCaso)
        success("Solicitação de caso enviada com sucesso!")
      }

      reset()
      setShowPreview(false)
      setClienteSelecionado(null)
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        router.push("/casos")
      }, 2000)

    } catch (error) {
      console.error("Erro ao salvar caso:", error)
      showError("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }, [user, success, showError, reset, router, adicionarCasoCliente, adicionarCasoAdvogado, clienteSelecionado, isAdvogado])

  const handleClienteSelect = (cliente: ClienteLista) => {
    setClienteSelecionado(cliente)
    setShowClienteModal(false)
  }

  const handleAdvogadoSelect = (advogado: any) => {
    setAdvogadoSelecionado(advogado)
    setShowAdvogadoModal(false)
  }

  const handlePreview = () => {
    if (isValid) {
      if (isAdvogado && !clienteSelecionado) {
        showError("Selecione um cliente antes de revisar")
        return
      }
      setShowPreview(true)
    }
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  if (showPreview) {
    const formData = getValues()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <CardTitle className="text-xl">Revisão da Solicitação</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleBackToForm}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm font-medium">
                  ⚠️ Revise cuidadosamente as informações antes de enviar sua solicitação
                </p>
              </div>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Cliente</Label>
                    <p className="mt-1 text-gray-900">{user?.nome}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Tipo de Processo</Label>
                    <p className="mt-1 text-gray-900">{getTipoProcessoLabel(formData.tipoProcesso)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Título do Caso</Label>
                  <p className="mt-1 text-gray-900 font-medium">{formData.titulo}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Descrição do Caso</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.descricao}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Situação Atual</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.situacaoAtual}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">Objetivos</Label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.objetivos}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Nível de Urgência</Label>
                    <div className={cn("mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block", getUrgenciaColor(formData.urgencia))}>
                      {getUrgenciaLabel(formData.urgencia)}
                    </div>
                  </div>
                </div>

                {formData.documentosDisponiveis && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Documentos Disponíveis</Label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{formData.documentosDisponiveis}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToForm}
                  className="flex-1"
                >
                  Voltar para Edição
                </Button>
                <Button
                  onClick={() => onSubmit(formData)}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Enviando..." : "Solicitar Abertura de Caso"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <Link href="/casos" className="mb-6 inline-block">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Nova Solicitação de Caso</h1>
              <p className="text-muted-foreground">Preencha os detalhes do seu caso jurídico</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <FileText className="h-3 w-3 mr-1" />
            Solicitação
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAdvogado ? (
                  // Para advogados: seletor de cliente
                  <div className="space-y-4">
                    {clienteSelecionado ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{clienteSelecionado.nome}</div>
                            <div className="text-sm text-muted-foreground">{clienteSelecionado.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowClienteModal(true)}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Trocar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Selecione o cliente para este caso</p>
                        <Button onClick={() => setShowClienteModal(true)}>
                          <Search className="h-4 w-4 mr-2" />
                          Buscar Cliente
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Para clientes: mostrar informações próprias + opção de selecionar advogado
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user?.nome}</div>
                        <div className="text-sm text-muted-foreground">Cliente solicitante</div>
                      </div>
                    </div>

                    {/* Seletor de advogado opcional */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Advogado (Opcional)</Label>
                      {advogadoSelecionado ? (
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{advogadoSelecionado.nome}</div>
                              <div className="text-xs text-muted-foreground">{advogadoSelecionado.email}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAdvogadoModal(true)}
                            >
                              <Search className="h-3 w-3 mr-1" />
                              Trocar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAdvogadoSelecionado(null)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setShowAdvogadoModal(true)}
                          className="w-full"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Selecionar Advogado (Opcional)
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Caso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título do Caso *</Label>
                    <Input
                      id="titulo"
                      placeholder="Ex: Rescisão de contrato de trabalho"
                      className={getFieldValidationClass("titulo")}
                      {...register("titulo")}
                    />
                    {errors.titulo && touchedFields.titulo && (
                      <p className="text-red-500 text-sm">{errors.titulo.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoProcesso">Tipo de Processo *</Label>
                    <Select
                      value={watchedValues.tipoProcesso}
                      onValueChange={(value) => setValue("tipoProcesso", value as TipoProcesso, { shouldValidate: true })}
                    >
                      <SelectTrigger className={getFieldValidationClass("tipoProcesso")}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TipoProcesso).map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {getTipoProcessoLabel(tipo)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoProcesso && (
                      <p className="text-red-500 text-sm">{errors.tipoProcesso.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição Detalhada do Caso *</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva detalhadamente o seu caso, incluindo datas, valores, partes envolvidas e outros detalhes relevantes..."
                    className={cn("min-h-[120px]", getFieldValidationClass("descricao"))}
                    {...register("descricao")}
                  />
                  <p className="text-xs text-gray-500">
                    {watchedValues.descricao?.length || 0}/1000 caracteres
                  </p>
                  {errors.descricao && touchedFields.descricao && (
                    <p className="text-red-500 text-sm">{errors.descricao.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situacaoAtual">Situação Atual *</Label>
                  <Textarea
                    id="situacaoAtual"
                    placeholder="Descreva a situação atual do problema, o que já foi tentado, prazos envolvidos..."
                    className={cn("min-h-[100px]", getFieldValidationClass("situacaoAtual"))}
                    {...register("situacaoAtual")}
                  />
                  <p className="text-xs text-gray-500">
                    {watchedValues.situacaoAtual?.length || 0}/500 caracteres
                  </p>
                  {errors.situacaoAtual && touchedFields.situacaoAtual && (
                    <p className="text-red-500 text-sm">{errors.situacaoAtual.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivos">Objetivos e Resultado Esperado *</Label>
                  <Textarea
                    id="objetivos"
                    placeholder="O que você espera alcançar com este caso? Quais são seus objetivos principais?"
                    className={cn("min-h-[100px]", getFieldValidationClass("objetivos"))}
                    {...register("objetivos")}
                  />
                  <p className="text-xs text-gray-500">
                    {watchedValues.objetivos?.length || 0}/500 caracteres
                  </p>
                  {errors.objetivos && touchedFields.objetivos && (
                    <p className="text-red-500 text-sm">{errors.objetivos.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgencia">Nível de Urgência *</Label>
                    <Select
                      value={watchedValues.urgencia}
                      onValueChange={(value) => setValue("urgencia", value as "baixa" | "media" | "alta", { shouldValidate: true })}
                    >
                      <SelectTrigger className={getFieldValidationClass("urgencia")}>
                        <SelectValue placeholder="Selecione o nível de urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Baixa - Não há pressa
                          </div>
                        </SelectItem>
                        <SelectItem value="media">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Média - Algumas semanas
                          </div>
                        </SelectItem>
                        <SelectItem value="alta">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Alta - Urgente
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.urgencia && (
                      <p className="text-red-500 text-sm">{errors.urgencia.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentosDisponiveis">Documentos Disponíveis (Opcional)</Label>
                    <Textarea
                      id="documentosDisponiveis"
                      placeholder="Liste os documentos que você possui relacionados ao caso..."
                      className="min-h-[80px]"
                      {...register("documentosDisponiveis")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com Resumo e Próximos Passos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Solicitação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm text-muted-foreground">
                    {isAdvogado 
                      ? (clienteSelecionado?.nome || "Não selecionado")
                      : (user?.nome || "Não informado")
                    }
                  </p>
                </div>

                {isAdvogado && (
                  <div>
                    <Label className="text-sm font-medium">Advogado Responsável</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.nome || "Não informado"}
                    </p>
                  </div>
                )}

                {!isAdvogado && advogadoSelecionado && (
                  <div>
                    <Label className="text-sm font-medium">Advogado Solicitado</Label>
                    <p className="text-sm text-muted-foreground">
                      {advogadoSelecionado.nome}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Tipo do Processo</Label>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.tipoProcesso ? getTipoProcessoLabel(watchedValues.tipoProcesso) : "Não selecionado"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.titulo || "Não informado"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Urgência</Label>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.urgencia ? getUrgenciaLabel(watchedValues.urgencia) : "Não selecionada"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="outline">Pendente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Funciona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {isAdvogado ? (
                    // Para advogados
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Seleção do Cliente</p>
                          <p className="text-muted-foreground">Escolha o cliente para este caso</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Criação do Processo</p>
                          <p className="text-muted-foreground">O caso será criado e associado ao cliente</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Acompanhamento</p>
                          <p className="text-muted-foreground">Você poderá acompanhar o progresso do caso</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Para clientes
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Seleção de Advogado (Opcional)</p>
                          <p className="text-muted-foreground">Escolha um advogado específico ou deixe em aberto</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Análise da Solicitação</p>
                          <p className="text-muted-foreground">Um advogado analisará seu caso</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Contato Inicial</p>
                          <p className="text-muted-foreground">Entraremos em contato para mais detalhes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Avaliação</p>
                          <p className="text-muted-foreground">Análise completa e proposta de atuação</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-muted-foreground">Abertura do Processo</p>
                          <p className="text-muted-foreground">Caso aprovado, daremos início aos trabalhos</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handlePreview}
                disabled={!isValid}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Revisar Solicitação
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de busca de cliente (apenas para advogados) */}
      {isAdvogado && (
        <ModalBuscaCliente
          isOpen={showClienteModal}
          onOpenChange={setShowClienteModal}
          onClienteSelect={handleClienteSelect}
        />
      )}

      {/* Modal de busca de advogado (para clientes) */}
      {!isAdvogado && (
        <ModalBuscaAdvogado
          isOpen={showAdvogadoModal}
          onOpenChange={setShowAdvogadoModal}
          onAdvogadoSelect={handleAdvogadoSelect}
        />
      )}
    </div>
  )
}
