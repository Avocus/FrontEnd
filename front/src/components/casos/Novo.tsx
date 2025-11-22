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
import { analiseIAService } from "@/services/analiseIAService"
import { TipoProcesso, StatusProcesso } from "@/types/enums"
import { ClienteLista } from "@/types/entities/Cliente"
import { CasoCliente, CasoAdvogado } from '@/types/entities'
import { ArrowLeft, FileText, CheckCircle2, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUrgenciaLabel, getUrgenciaStyles } from "@/lib/urgency"
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

export default function NovoCaso() {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const { success, error: showError, status: showStatus } = useToast()
  const router = useRouter()
  const { adicionarCasoCliente, adicionarCasoAdvogado } = useCasoStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showAdvogadoModal, setShowAdvogadoModal] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLista | null>(null)
  type ModalAdvogado = {
    id: string;
    nome: string;
    email: string;
    especialidades?: string[];
    experiencia?: string;
  }

  const [advogadoSelecionado, setAdvogadoSelecionado] = useState<ModalAdvogado | null>(null)

  const {
    register,
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

  // usadas para apresentar rótulos e classes consistentes de urgência
  // agora centralizadas em src/lib/urgency.ts

  const formatDate = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Monta o payload completo do caso com base nos valores do formulário e seleções
  const createCasoPayload = useCallback((values: NovoCasoFormData) => {
    const timestamp = new Date().toISOString()
    const id = Date.now().toString()

    if (isAdvogado) {
      return {
        id,
        clienteId: clienteSelecionado?.id?.toString() || "unknown",
        clienteNome: clienteSelecionado?.nome || "Não informado",
        advogadoId: user?.id || "unknown",
        advogadoNome: user?.nome || "Advogado não informado",
        titulo: values.titulo,
        tipoProcesso: values.tipoProcesso,
        descricao: values.descricao,
        situacaoAtual: values.situacaoAtual,
        objetivos: values.objetivos,
        urgencia: values.urgencia,
        documentosDisponiveis: values.documentosDisponiveis,
        dataSolicitacao: timestamp,
        status: StatusProcesso.RASCUNHO,
      }
    }

    // Para clientes
    return {
      id,
      clienteId: user?.client?.toString() || "unknown",
      clienteNome: user?.nome || "Nome não informado",
      advogadoId: advogadoSelecionado?.id || null,
      advogadoNome: advogadoSelecionado?.nome || null,
      titulo: values.titulo,
      tipoProcesso: values.tipoProcesso,
      descricao: values.descricao,
      situacaoAtual: values.situacaoAtual,
      objetivos: values.objetivos,
      urgencia: values.urgencia,
      documentosDisponiveis: values.documentosDisponiveis,
      dataSolicitacao: timestamp,
      status: StatusProcesso.RASCUNHO,
    }
  }, [isAdvogado, clienteSelecionado, advogadoSelecionado, user])

  const onSubmit = useCallback(async (data: NovoCasoFormData) => {
    if (!user) {
      showError("Usuário não autenticado")
      return
    }

    setIsLoading(true)

    try {
      // Criar payload unificado e salvar no localStorage antes de persistir
      const payload = createCasoPayload(data)
      try {
        localStorage.setItem("novoCasoPayload", JSON.stringify(payload))
      } catch (err) {
        console.error("Erro ao salvar payload no localStorage:", err)
      }

      if (isAdvogado) {
        if (!clienteSelecionado) {
          showError("Selecione um cliente para o caso")
          return
        }
  adicionarCasoAdvogado(payload as unknown as CasoAdvogado)

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
          status: StatusProcesso.RASCUNHO
        }

        adicionarCasoAdvogado(novoCaso)
        success("Caso criado com sucesso!")
        if (typeof showStatus === "function") {
          showStatus(String(payload.status).toLowerCase(), "Caso criado com sucesso!")
        }
      } else {
        // Para clientes, primeiro rodar análise IA para validar/corrigir/resumir
        try {
          const aiResult = await analiseIAService({
            clienteId: Number(user?.client) || 0,
            titulo: data.titulo,
            descricao: data.descricao,
          })

          if (!aiResult.success) {
            // IA decidiu que não é caso jurídico ou informação insuficiente
            showError(aiResult.message || "Não foi possível abrir o caso: informação insuficiente.")
            return
          }

          // Substitui campos do payload com versão normalizada pela IA quando disponível
          if (aiResult.caso) {
            // mapa simples entre string retornada pela IA e o enum TipoProcesso
            const aiTipo = (aiResult.caso.tipoProcesso || "CIVIL").toString()
            const mappedTipo = (TipoProcesso as unknown as Record<string, TipoProcesso>)[aiTipo] || payload.tipoProcesso

            payload.titulo = aiResult.caso.titulo || payload.titulo
            payload.descricao = aiResult.caso.descricao || payload.descricao
            payload.tipoProcesso = mappedTipo
          }

          adicionarCasoCliente(payload as unknown as CasoCliente)
          success("Solicitação de caso enviada com sucesso!")
          if (typeof showStatus === "function") {
            showStatus(String(payload.status).toLowerCase(), "Solicitação de caso enviada com sucesso!")
          }
        } catch (err) {
          console.error("Erro ao analisar com IA:", err)
          showError("Erro ao analisar sua solicitação. Tente novamente mais tarde.")
          return
        }
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
  }, [user, success, showError, reset, router, adicionarCasoCliente, adicionarCasoAdvogado, clienteSelecionado, isAdvogado, createCasoPayload, showStatus])

  const handleClienteSelect = (cliente: ClienteLista) => {
    setClienteSelecionado(cliente)
    setShowClienteModal(false)
  }

  const handleAdvogadoSelect = (advogado: ModalAdvogado) => {
    setAdvogadoSelecionado(advogado)
    setShowAdvogadoModal(false)
  }

  const handlePreview = () => {
    if (isValid) {
      if (isAdvogado && !clienteSelecionado) {
        showError("Selecione um cliente antes de revisar")
        return
      }

      const values = getValues()
      const payload = createCasoPayload(values)
      try {
        // salvar uma pré-visualização no localStorage (temporariamente)
        localStorage.setItem("novoCasoPreview", JSON.stringify(payload))
      } catch (err) {
        // se falhar, apenas logamos e seguimos para a pré-visualização
        console.error("Erro ao salvar preview no localStorage:", err)
      }

      setShowPreview(true)
    }
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  if (showPreview) {
    const formData = getValues()
    const payload = createCasoPayload(formData)

    // tela de resumo (visual mais alinhado com a tela de novo caso)
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <Link href="/casos" className="mb-6 inline-block">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Revisão da Solicitação</h1>
                <p className="text-muted-foreground">Revise todas as informações antes de enviar</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <FileText className="h-3 w-3 mr-1" />
              Revisão
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">Cliente</Label>
                        <p className="mt-1 text-muted-foreground">{payload.clienteNome}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-foreground">Advogado</Label>
                        <p className="mt-1 text-muted-foreground">{payload.advogadoNome || "Não informado"}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground">Tipo de Processo</Label>
                    <p className="mt-1 text-muted-foreground">{getTipoProcessoLabel(payload.tipoProcesso as TipoProcesso)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground">Título</Label>
                    <p className="mt-1 text-muted-foreground font-medium">{payload.titulo}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground">Descrição</Label>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{payload.descricao}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground">Situação Atual</Label>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{payload.situacaoAtual}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-foreground">Objetivos</Label>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{payload.objetivos}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-foreground">Nível de Urgência</Label>
                      <div className={cn("mt-2 px-3 py-1 rounded-full text-sm font-medium w-fit", getUrgenciaStyles(payload.urgencia).pill)}>
                        {getUrgenciaLabel(payload.urgencia)}
                      </div>
                    </div>

                    <div>
                    <Label className="text-sm font-semibold text-foreground">Data da Solicitação</Label>
                      <p className="mt-1 text-muted-foreground">{formatDate(payload.dataSolicitacao)}</p>
                    </div>
                  </div>

                  {payload.documentosDisponiveis && (
                    <div>
                      <Label className="text-sm font-semibold text-foreground">Documentos Disponíveis</Label>
                        <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{payload.documentosDisponiveis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4 pt-4">
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
                  className="flex-1"
                >
                  {isLoading ? "Enviando..." : "Solicitar Abertura de Caso"}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Cliente</Label>
                    <p className="text-sm text-muted-foreground">{payload.clienteNome}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Advogado</Label>
                    <p className="text-sm text-muted-foreground">{payload.advogadoNome || "Nenhum"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tipo do Processo</Label>
                    <p className="text-sm text-muted-foreground">{payload.tipoProcesso ? getTipoProcessoLabel(payload.tipoProcesso as TipoProcesso) : "Não selecionado"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Título</Label>
                    <p className="text-sm text-muted-foreground">{payload.titulo || "Não informado"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Urgência</Label>
                    <p className="text-sm text-muted-foreground">{payload.urgencia ? getUrgenciaLabel(payload.urgencia) : "Não selecionada"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant="outline">{payload.status}</Badge>
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
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Seleção do Cliente</p>
                            <p className="text-muted-foreground">Escolha o cliente para este caso</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium">Seleção de Advogado (Opcional)</p>
                            <p className="text-muted-foreground">Escolha um advogado específico ou deixe em aberto</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // tela de novo caso
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
                  <Badge variant="outline">{StatusProcesso.RASCUNHO}</Badge>
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
