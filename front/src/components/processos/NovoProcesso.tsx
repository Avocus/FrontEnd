"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NovoProcessoForm from "./NovoProcessoForm"
import NovoProcessoPreview from "./NovoProcessoPreview"
import { useNovoProcesso, NovoProcessoFormData } from "@/hooks/useNovoProcesso"
import { useLayout } from "@/contexts/LayoutContext"
import { useAuthStore } from "@/store"
import { StatusProcesso } from "@/types/enums"

export default function NovoProcesso() {
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<NovoProcessoFormData | null>(null)
  const [previewPayload, setPreviewPayload] = useState<any>(null)
  const { isAdvogado } = useLayout()
  const { user } = useAuthStore()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("novoProcessoPreview")
      if (saved) {
        const parsed = JSON.parse(saved)
        // Extract form data from payload
        const formData: NovoProcessoFormData = {
          titulo: parsed.titulo || "",
          tipoProcesso: parsed.tipoProcesso || undefined,
          descricao: parsed.descricao || "",
          situacaoAtual: parsed.situacaoAtual || "",
          objetivos: parsed.objetivos || "",
          urgencia: parsed.urgencia || undefined,
          documentosDisponiveis: parsed.documentosDisponiveis || "",
        }
        setPreviewData(formData)
        setPreviewPayload(parsed)
      }
    } catch (err) {
      console.error("Erro ao carregar dados do localStorage:", err)
    }
  }, [])

  const {
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
  } = useNovoProcesso()

  const handlePreview = async (data: NovoProcessoFormData) => {
    // Sugerir documentos com IA antes de mostrar preview
    const documentos = await sugerirDocumentos(data)
    
    // Inicialmente, todos os documentos são selecionados
    const dataComDocumentos = {
      ...data,
      documentosSugeridos: documentos,
      documentosSelecionados: documentos, // Todos selecionados por padrão
    }
    
    // Criar payload para preview
    const payload = {
      clienteNome: isAdvogado 
        ? (clienteSelecionado?.nome || "Não selecionado")
        : (user?.nome || "Não informado"),
      advogadoNome: isAdvogado 
        ? (user?.nome || "Advogado não informado")
        : (advogadoSelecionado?.nome || "Não informado"),
      titulo: data.titulo,
      tipoProcesso: data.tipoProcesso,
      descricao: data.descricao,
      situacaoAtual: data.situacaoAtual,
      objetivos: data.objetivos,
      urgencia: data.urgencia,
      documentosDisponiveis: data.documentosDisponiveis,
      documentosSugeridos: documentos,
      documentosSelecionados: documentos, // Todos selecionados por padrão
      dataSolicitacao: new Date().toISOString(),
      status: StatusProcesso.RASCUNHO,
    }
    
    setPreviewData(dataComDocumentos)
    setPreviewPayload(payload)
    try {
      localStorage.setItem("novoProcessoPreview", JSON.stringify(payload))
    } catch (err) {
      console.error("Erro ao salvar preview no localStorage:", err)
    }
    setShowPreview(true)
  }

  const handleDocumentoToggle = (documento: string) => {
    if (!previewData || !previewPayload) return
    
    const currentSelected = previewPayload.documentosSelecionados || []
    const newSelected = currentSelected.includes(documento)
      ? currentSelected.filter((d: string) => d !== documento)
      : [...currentSelected, documento]
    
    const updatedData = {
      ...previewData,
      documentosSelecionados: newSelected,
    }
    
    const updatedPayload = {
      ...previewPayload,
      documentosSelecionados: newSelected,
    }
    
    setPreviewData(updatedData)
    setPreviewPayload(updatedPayload)
    
    try {
      localStorage.setItem("novoProcessoPreview", JSON.stringify(updatedPayload))
    } catch (err) {
      console.error("Erro ao salvar preview no localStorage:", err)
    }
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  const handleSubmitFromPreview = () => {
    if (previewData) {
      onSubmit(previewData)
      // Clear localStorage after successful submission
      localStorage.removeItem("novoProcessoPreview")
    }
  }

  if (showPreview && previewData && previewPayload) {
    return (
      <NovoProcessoPreview
        formData={previewData}
        payload={previewPayload}
        isAdvogado={isAdvogado}
        onBackToForm={handleBackToForm}
        onSubmit={handleSubmitFromPreview}
        onDocumentoToggle={handleDocumentoToggle}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <Link href="/processos" className="mb-6 inline-block">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Nova Solicitação de Processo</h1>
              <p className="text-muted-foreground">Preencha os detalhes do seu processo jurídico</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <FileText className="h-3 w-3 mr-1" />
            Solicitação
          </Badge>
        </div>

        <NovoProcessoForm
          onPreview={handlePreview}
          initialData={previewData}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
          advogadoSelecionado={advogadoSelecionado}
          setAdvogadoSelecionado={setAdvogadoSelecionado}
          showClienteModal={showClienteModal}
          setShowClienteModal={setShowClienteModal}
          showAdvogadoModal={showAdvogadoModal}
          setShowAdvogadoModal={setShowAdvogadoModal}
          isLoadingIA={isLoadingIA}
        />
      </div>
    </div>
  )
}
