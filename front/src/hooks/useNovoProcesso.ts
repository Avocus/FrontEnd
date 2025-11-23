import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useProcessoStore } from "@/store"
import { useToast } from "@/hooks/useToast"
import { analiseIAService } from "@/services/analiseIAService"
import { criarProcesso, CriarProcessoRequest } from "@/services/processo/processoService"
import { TipoProcesso, StatusProcesso } from "@/types/enums"
import { ClienteLista } from "@/types/entities/Cliente"
import { ProcessoCliente, ProcessoAdvogado } from '@/types/entities'
import { useLayout } from "@/contexts/LayoutContext"

export interface NovoProcessoFormData {
  titulo: string
  tipoProcesso: TipoProcesso
  descricao: string
  situacaoAtual: string
  objetivos: string
  urgencia: "baixa" | "media" | "alta"
  documentosDisponiveis?: string
}

export function useNovoProcesso() {
  const { user } = useAuthStore()
  const { isAdvogado } = useLayout()
  const { success, error: showError, status: showStatus } = useToast()
  const router = useRouter()
  const { adicionarProcessoCliente } = useProcessoStore()
  const [isLoading, setIsLoading] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLista | null>(null)
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState<{ id: string; nome: string; email: string; especialidades?: string[]; experiencia?: string } | null>(null)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showAdvogadoModal, setShowAdvogadoModal] = useState(false)

  const onSubmit = useCallback(async (data: NovoProcessoFormData) => {
    if (!user) {
      showError("Usuário não autenticado")
      return
    }

    setIsLoading(true)

    try {
      let finalData = data

      if (!isAdvogado) {
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
      }

      if(isAdvogado && (!clienteSelecionado || !clienteSelecionado.id)) {
        showError("Cliente não encontrado | Não definido corretamente")
        return;
      }

      console.log(user, clienteSelecionado)

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

      const novoProcesso = await criarProcesso(processoRequest as CriarProcessoRequest)

      if (isAdvogado) {
        if (!clienteSelecionado) {
          showError("Selecione um cliente para o processo")
          return
        }

        const processoAdvogado: ProcessoAdvogado = {
          id: novoProcesso.id.toString(),
          cliente: {
            id: parseInt(clienteSelecionado.id),
            nome: clienteSelecionado.nome,
            email: clienteSelecionado.email || "",
          },
          advogado: {
            id: parseInt(user.id || "0"),
            nome: user.nome || "Advogado não informado",
            email: user.email || "",
            oab: "",
          },
          titulo: finalData.titulo,
          tipoProcesso: finalData.tipoProcesso,
          descricao: finalData.descricao,
          situacaoAtual: finalData.situacaoAtual,
          objetivos: finalData.objetivos,
          urgencia: finalData.urgencia,
          documentosDisponiveis: finalData.documentosDisponiveis,
          dataSolicitacao: new Date().toISOString(),
          dataAceite: new Date().toISOString(),
          status: StatusProcesso.RASCUNHO
        }

        success("Processo criado com sucesso!")
      } else {
        const processoCliente: ProcessoCliente = {
          id: novoProcesso.id.toString(),
          cliente: {
            id: parseInt(user?.id || "0"),
            nome: user?.nome || "Nome não informado",
            email: user?.email || "",
          },
          advogado: advogadoSelecionado ? {
            id: parseInt(advogadoSelecionado.id),
            nome: advogadoSelecionado.nome,
            email: advogadoSelecionado.email || "",
            oab: "",
          } : undefined,
          titulo: finalData.titulo,
          tipoProcesso: finalData.tipoProcesso,
          descricao: finalData.descricao,
          situacaoAtual: finalData.situacaoAtual,
          objetivos: finalData.objetivos,
          urgencia: finalData.urgencia,
          documentosDisponiveis: finalData.documentosDisponiveis,
          dataSolicitacao: new Date().toISOString(),
          status: StatusProcesso.RASCUNHO
        }

        adicionarProcessoCliente(processoCliente)
        success("Solicitação de processo enviada com sucesso!")
      }

      if (typeof showStatus === "function") {
        showStatus(String(StatusProcesso.RASCUNHO).toLowerCase(), "Processo criado com sucesso!")
      }

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
  }, [user, success, showError, router, adicionarProcessoCliente, clienteSelecionado, advogadoSelecionado, isAdvogado, showStatus])

  return {
    isLoading,
    clienteSelecionado,
    setClienteSelecionado,
    advogadoSelecionado,
    setAdvogadoSelecionado,
    showClienteModal,
    setShowClienteModal,
    showAdvogadoModal,
    setShowAdvogadoModal,
    onSubmit,
  }
}