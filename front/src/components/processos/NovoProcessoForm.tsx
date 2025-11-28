import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store"
import { useToast } from "@/hooks/useToast"
import { TipoProcesso, StatusProcesso, getStatusProcessoLabel, getTipoProcessoLabel } from "@/types/enums"
import { ClienteLista } from "@/types/entities/Cliente"
import { User, Search, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUrgenciaLabel } from "@/lib/urgency"
import { ModalBuscaCliente } from "./ModalBuscaCliente"
import { ModalBuscaAdvogado } from "./ModalBuscaAdvogado"
import { useLayout } from "@/contexts/LayoutContext"

// Schema de validação para o formulário
const novoProcessoSchema = z.object({
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
  urgencia: z.enum(["BAIXA", "MEDIA", "ALTA"], {
    message: "Selecione um nível de urgência"
  }),
  documentosDisponiveis: z.string().optional(),
})

type NovoProcessoFormData = z.infer<typeof novoProcessoSchema>

interface NovoProcessoFormProps {
  onPreview: (data: NovoProcessoFormData) => void
  initialData?: NovoProcessoFormData | null
  clienteSelecionado: ClienteLista | null
  setClienteSelecionado: (cliente: ClienteLista | null) => void
  advogadoSelecionado: { id: string; nome: string; email: string; especialidades?: string[]; experiencia?: string } | null
  setAdvogadoSelecionado: (advogado: { id: string; nome: string; email: string; especialidades?: string[]; experiencia?: string } | null) => void
  showClienteModal: boolean
  setShowClienteModal: (show: boolean) => void
  showAdvogadoModal: boolean
  setShowAdvogadoModal: (show: boolean) => void
}

export default function NovoProcessoForm({
  onPreview,
  initialData,
  clienteSelecionado,
  setClienteSelecionado,
  advogadoSelecionado,
  setAdvogadoSelecionado,
  showClienteModal,
  setShowClienteModal,
  showAdvogadoModal,
  setShowAdvogadoModal,
}: NovoProcessoFormProps) {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const { error: showError } = useToast()

  const {
    register,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    getValues,
  } = useForm<NovoProcessoFormData>({
    resolver: zodResolver(novoProcessoSchema),
    mode: "onChange",
    defaultValues: initialData || {
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

  const getFieldValidationClass = (fieldName: keyof NovoProcessoFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasError = errors[fieldName]
    
    if (!isTouched) return ""
    
    if (hasError) return "border-red-500 focus:border-red-500"
    return "border-green-500 focus:border-green-500"
  }

  // getTipoProcessoLabel is imported from enums

  const handleClienteSelect = (cliente: ClienteLista) => {
    setClienteSelecionado(cliente)
    setShowClienteModal(false)
  }

  const handleAdvogadoSelect = (advogado: { id: string; nome: string; email: string; especialidades?: string[]; experiencia?: string }) => {
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
      onPreview(values)
    }
  }

  return (
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
                    <p className="text-muted-foreground mb-4">Selecione o cliente para este processo</p>
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
            <CardTitle>Detalhes do Processo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título do Processo *</Label>
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
              <Label htmlFor="descricao">Descrição Detalhada do Processo *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o seu processo, incluindo datas, valores, partes envolvidas e outros detalhes relevantes..."
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
                placeholder="O que você espera alcançar com este processo? Quais são seus objetivos principais?"
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
                  onValueChange={(value) => setValue("urgencia", value as "BAIXA" | "MEDIA" | "ALTA", { shouldValidate: true })}
                >
                  <SelectTrigger className={getFieldValidationClass("urgencia")}>
                    <SelectValue placeholder="Selecione o nível de urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAIXA">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Baixa - Não há pressa
                      </div>
                    </SelectItem>
                    <SelectItem value="MEDIA">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Média - Algumas semanas
                      </div>
                    </SelectItem>
                    <SelectItem value="ALTA">
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
                  placeholder="Liste os documentos que você possui relacionados ao processo..."
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
              <Badge variant="outline">{getStatusProcessoLabel(StatusProcesso.RASCUNHO)}</Badge>
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
                      <p className="text-muted-foreground">Escolha o cliente para este processo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Criação do Processo</p>
                      <p className="text-muted-foreground">O processo será criado e associado ao cliente</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Acompanhamento</p>
                      <p className="text-muted-foreground">Você poderá acompanhar o progresso do processo</p>
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
                      <p className="text-muted-foreground">Um advogado analisará seu processo</p>
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
                      <p className="text-muted-foreground">Processo aprovado, daremos início aos trabalhos</p>
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