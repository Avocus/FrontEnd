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
              <Label className="text-sm font-medium">Status</Label>
              <p className="text-sm text-muted-foreground">Aberto</p>
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