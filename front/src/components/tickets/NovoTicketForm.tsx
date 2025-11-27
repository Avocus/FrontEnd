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
import { useAuthStore } from "@/store"
import { useNovoTicket, NovoTicketFormData } from "@/hooks/useNovoTicket";
import { TipoProcesso, getTipoProcessoLabel } from "@/types/enums"
import { cn } from "@/lib/utils"
import { getUrgenciaLabel } from "@/lib/urgency"

// Schema de validação para o formulário
const novoTicketSchema = z.object({
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
})

type LocalNovoTicketFormData = z.infer<typeof novoTicketSchema>

export default function NovoTicketForm() {
  const { user } = useAuthStore()
  const { isLoading, onSubmit } = useNovoTicket()

  const {
    register,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    handleSubmit,
  } = useForm<LocalNovoTicketFormData>({
    resolver: zodResolver(novoTicketSchema),
    mode: "onChange",
    defaultValues: {
      titulo: "",
      tipoProcesso: undefined,
      descricao: "",
      situacaoAtual: "",
      objetivos: "",
      urgencia: undefined,
    }
  })

  const watchedValues = watch()

  const getFieldValidationClass = (fieldName: keyof LocalNovoTicketFormData) => {
    const isTouched = touchedFields[fieldName]
    const hasError = errors[fieldName]
    
    if (!isTouched) return ""
    
    if (hasError) return "border-red-500 focus:border-red-500"
    return "border-green-500 focus:border-green-500"
  }

  const handleSubmitForm = async (data: LocalNovoTicketFormData) => {
    const ticketData: NovoTicketFormData = {
      titulo: data.titulo,
      tipoProcesso: data.tipoProcesso,
      descricao: data.descricao,
      situacaoAtual: data.situacaoAtual,
      objetivos: data.objetivos,
      urgencia: data.urgencia,
    };
    await onSubmit(ticketData);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário Principal */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Solicitante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <div className="font-medium">{user?.nome}</div>
              <div className="text-sm text-muted-foreground">Cliente solicitante</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Solicitação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Solicitação *</Label>
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
              <Label htmlFor="descricao">Descrição Detalhada da Solicitação *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente a sua solicitação, incluindo datas, valores, partes envolvidas e outros detalhes relevantes..."
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
                placeholder="O que você espera alcançar com esta solicitação? Quais são seus objetivos principais?"
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar com Resumo */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Solicitação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Cliente</Label>
              <p className="text-sm text-muted-foreground">
                {user?.nome || "Não informado"}
              </p>
            </div>

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
              <p className="text-sm text-muted-foreground">Solicitado</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit(handleSubmitForm)}
            disabled={!isValid || isLoading}
            className="flex-1"
          >
            {isLoading ? "Criando..." : "Criar Ticket"}
          </Button>
        </div>
      </div>
    </div>
  )
}