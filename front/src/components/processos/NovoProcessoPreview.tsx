import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUrgenciaLabel, getUrgenciaStyles } from "@/lib/urgency"
import { TipoProcesso, getTipoProcessoLabel, getStatusProcessoLabel, StatusProcesso } from "@/types/enums"
import Link from "next/link"

interface NovoProcessoPreviewProps {
  formData: {
    titulo: string
    tipoProcesso: TipoProcesso
    descricao: string
    situacaoAtual: string
    objetivos: string
    urgencia: "BAIXA" | "MEDIA" | "ALTA"
    documentosDisponiveis?: string
  }
  payload: {
    clienteNome: string
    advogadoNome?: string
    titulo: string
    tipoProcesso: TipoProcesso
    descricao: string
    situacaoAtual: string
    objetivos: string
    urgencia: "BAIXA" | "MEDIA" | "ALTA"
    documentosDisponiveis?: string
    dataSolicitacao: string
    status: string
  }
  isAdvogado: boolean
  onBackToForm: () => void
  onSubmit: () => void
  isLoading: boolean
}

export default function NovoProcessoPreview({
  formData,
  payload,
  isAdvogado,
  onBackToForm,
  onSubmit,
  isLoading,
}: NovoProcessoPreviewProps) {
  // getTipoProcessoLabel is imported from enums

  const formatDate = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <Link href="/processos" className="mb-6 inline-block">
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
                onClick={onBackToForm}
                className="flex-1"
              >
                Voltar para Edição
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Enviando..." : "Solicitar Abertura de Processo"}
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
                  <Badge variant="outline">{getStatusProcessoLabel(payload.status as StatusProcesso)}</Badge>
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
                          <p className="text-muted-foreground">Escolha o cliente para este processo</p>
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