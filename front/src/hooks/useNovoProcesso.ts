import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store"
import { useToast } from "@/hooks/useToast"
import { analiseIAService } from "@/services/analiseIAService"
import { criarProcesso, CriarProcessoRequest, DadoRequisitadoRequest } from "@/services/processo/processoService"
import { sugerirDocumentosIA } from "@/services/gemini/geminiService"
import { TipoProcesso, StatusProcesso, getTipoProcessoLabel } from "@/types/enums"
import { ClienteLista } from "@/types/entities/Cliente"
import { useLayout } from "@/contexts/LayoutContext"

export interface NovoProcessoFormData {
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

export function useNovoProcesso() {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const { success, error: showError, status: showStatus } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingIA, setIsLoadingIA] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLista | null>(null)
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState<{ id: string; nome: string; email: string; especialidades?: string[]; experiencia?: string } | null>(null)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showAdvogadoModal, setShowAdvogadoModal] = useState(false)
  const [documentosSugeridos, setDocumentosSugeridos] = useState<string[]>([])

  const sugerirDocumentos = useCallback(async (data: NovoProcessoFormData) => {
    setIsLoadingIA(true)
    try {
      const documentos = await sugerirDocumentosIA({
        titulo: data.titulo,
        descricao: data.descricao,
        tipoProcesso: getTipoProcessoLabel(data.tipoProcesso),
        situacaoAtual: data.situacaoAtual,
        objetivos: data.objetivos,
      })
      setDocumentosSugeridos(documentos)
      return documentos
    } catch (error) {
      console.error("Erro ao sugerir documentos:", error)
      return []
    } finally {
      setIsLoadingIA(false)
    }
  }, [])

  const onSubmit = useCallback(async (data: NovoProcessoFormData) => {
    if (!user) {
      showError("Usuário não autenticado")
      return
    }

    setIsLoading(true)

    try {
      let finalData = data

      try {
        const aiResult = await analiseIAService({
          clienteId: Number(user?.client) || 0,
          titulo: data.titulo,
          descricao: data.descricao,
        })

        if (!aiResult.success) {
          showError(aiResult.message || "Não foi possível abrir o processo: informação insuficiente.")
          return
        }

        if (aiResult.processo) {
          finalData = {
            ...data,
            titulo: aiResult.processo.titulo || data.titulo,
            descricao: aiResult.processo.descricao || data.descricao,
            tipoProcesso: (aiResult.processo.tipoProcesso as TipoProcesso) || data.tipoProcesso,
          }
        }
      } catch (err) {
        console.error("Erro ao analisar com IA:", err)
        showError("Erro ao analisar sua solicitação. Tente novamente mais tarde.")
        return
      }

      if(isAdvogado && (!clienteSelecionado || !clienteSelecionado.id)) {
        showError("Cliente não encontrado | Não definido corretamente")
        return;
      }

      const processoRequest = {
        clienteId: isAdvogado ? clienteSelecionado?.id?.toString() : user?.id,
        advogadoId: isAdvogado ? user?.id : advogadoSelecionado?.id,
        tipoProcesso: finalData.tipoProcesso,
        titulo: finalData.titulo,
        descricao: finalData.descricao,
        situacaoAtual: finalData.situacaoAtual,
        objetivos: finalData.objetivos,
        urgencia: finalData.urgencia,
        documentosDisponiveis: finalData.documentosDisponiveis,
        status: StatusProcesso.RASCUNHO,
      }

      if (!processoRequest.clienteId) {
        showError("Cliente não identificado")
        return
      }

      // Adicionar apenas os documentos SELECIONADOS pelo usuário
      const dadosRequisitados: DadoRequisitadoRequest[] = (data.documentosSelecionados || []).map(doc => ({
        nomeDado: doc,
        tipo: 'DOCUMENTO' as const,
        responsavel: 'CLIENTE' as const,
      }))

      console.log('📄 Documentos selecionados para criar solicitações:', data.documentosSelecionados)
      console.log('📋 Dados requisitados que serão enviados:', dadosRequisitados)

      // TODO - ao criar como cliente, rascunho, ao criar como advogado, pendente
      const processoCompleto = {
        ...processoRequest,
        dadosRequisitados,
      }

      console.log('🚀 Payload completo sendo enviado para criar processo:', processoCompleto)

      await criarProcesso(processoCompleto as CriarProcessoRequest)

      success(isAdvogado ? "Processo criado com sucesso!" : "Solicitação de processo enviada com sucesso!")

      // Redirecionar após um breve delay
      setTimeout(() => {
        router.push("/processos")
      }, 2000)

    } catch (error) {
      console.error("Erro ao criar processo:", error)
      showError("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }, [user, success, showError, router, clienteSelecionado, advogadoSelecionado, isAdvogado, showStatus])

  return {
    isLoading,
    isLoadingIA,
    clienteSelecionado,
    setClienteSelecionado,
    advogadoSelecionado,
    setAdvogadoSelecionado,
    showClienteModal,
    setShowClienteModal,
    showAdvogadoModal,
    setShowAdvogadoModal,
    documentosSugeridos,
    sugerirDocumentos,
    onSubmit,
  }
}