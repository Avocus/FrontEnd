import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileText, Sparkles, CheckCircle } from "lucide-react"
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
    documentosSugeridos?: string[]
    documentosSelecionados?: string[]
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
    documentosSugeridos?: string[]
    documentosSelecionados?: string[]
    dataSolicitacao: string
    status: string
  }
  isAdvogado: boolean
  onBackToForm: () => void
  onSubmit: () => void
  onDocumentoToggle: (documento: string) => void
  isLoading: boolean
}

export default function NovoProcessoPreview({
  payload,
  isAdvogado,
  onBackToForm,
  onSubmit,
  onDocumentoToggle,
  isLoading,
}: NovoProcessoPreviewProps) {
  const documentosSelecionados = payload.documentosSelecionados || [];
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

            {/* Card de Documentos Sugeridos pela IA */}
            {payload.documentosSugeridos && payload.documentosSugeridos.length > 0 && isAdvogado && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Documentos Necessários (Sugeridos pela IA)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nossa IA analisou seu processo e sugere os seguintes documentos. <strong>Clique para selecionar</strong> quais deseja solicitar ao criar o processo.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {payload.documentosSugeridos.map((doc, index) => {
                      const isSelected = documentosSelecionados.includes(doc);
                      return (
                        <button
                          key={index}
                          onClick={() => onDocumentoToggle(doc)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full",
                            isSelected 
                              ? "bg-primary border-border hover:border-secondary" 
                              : "bg-background border-primary shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                            isSelected 
                             ? "bg-muted text-muted-foreground"
                            : "bg-primary text-primary-foreground" 
                          )}>
                            <CheckCircle className={cn(
                              "h-4 w-4 transition-all",
                              isSelected ? "scale-100" : "scale-75 opacity-50"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium truncate transition-colors",
                              isSelected ? "text-foreground" : "text-muted-foreground"
                            )}>{doc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 <strong>Selecionados: {documentosSelecionados.length}</strong> de {payload.documentosSugeridos.length} documentos serão solicitados automaticamente ao criar o processo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                variant={"primary"}
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