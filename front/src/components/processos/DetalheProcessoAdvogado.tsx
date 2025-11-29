/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import { useProcessoStore } from "@/store";
import { ProcessoAdvogado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { FileText, Send } from "lucide-react";
import Link from "next/link";

// Hooks customizados
import { useProcessoDetalhes } from "@/hooks/useProcessoDetalhes";
import { useTimeline } from "@/hooks/useTimeline";

// Componentes compartilhados
import { VisaoGeralComponent } from "./shared/VisaoGeralComponent";
import { DocumentosComponent } from "./shared/DocumentosComponent";
import { TimelineComponent } from "./shared/TimelineComponent";
import { SolicitarDocumentoModal } from "./SolicitarDocumentoModal";
import { EventosComponent } from "./shared/EventosComponent";
import Chat from "./shared/Chat";
import { DadosRequisitadosList } from "./DadosRequisitadosList";
import { DocumentosList } from "./DocumentosList";
import { UploadDocumentoButton } from "./UploadDocumentoButton";

// Utilitários
import { getStatusLabel, getStatusBadgeVariant } from "@/utils/processoUtils";

interface DetalheProcessoAdvogadoProps {
  processoId: string;
}

export function DetalheProcessoAdvogado({ processoId }: DetalheProcessoAdvogadoProps) {
  const { success, error } = useToast();
  const { atualizarProcessoCliente, atualizarProcessoAdvogado } = useProcessoStore();

  // Usar hook customizado para carregar detalhes do processo
  const { processo, setProcesso, loading } = useProcessoDetalhes({ processoId, isAdvogado: true });

  // Hook para timeline
  const { addTimelineEntry } = useTimeline();
  const [modalSolicitarAberto, setModalSolicitarAberto] = useState(false);

  const solicitarDocumentos = () => {
    if (!processo) return;

    try {
      // Atualizar o processo do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aceito", // status atual do processo cliente
        "aguardando_documentos",
        `Advogado solicitou documentos adicionais`,
        "advogado",
        `Solicitação feita pelo advogado ${processo.advogado?.nome}`
      );

      atualizarProcessoCliente(processo.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(processo.timeline || []), timelineEntryCliente]
      });

      // Atualizar o processo do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        processo.status,
        StatusProcesso.AGUARDANDO_DADOS,
        `Advogado solicitou documentos adicionais`,
        "advogado",
        `Solicitação feita pelo advogado ${processo.advogado?.nome}`
      );

      atualizarProcessoAdvogado(processo.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(processo.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setProcesso({ ...processo, status: StatusProcesso.AGUARDANDO_DADOS });

      success("Solicitação de documentos enviada ao cliente!");
    } catch (err) {
      console.error("Erro ao solicitar documentos:", err);
      error("Erro ao solicitar documentos. Tente novamente.");
    }
  };

  const aprovarDocumentos = () => {
    if (!processo) return;

    try {
      // Atualizar o processo do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aguardando_analise_documentos",
        "em_andamento",
        `Documentos aprovados pelo advogado`,
        "advogado",
        `Advogado ${processo.advogado?.nome} aprovou os documentos enviados`
      );

      atualizarProcessoCliente(processo.id, {
        status: StatusProcesso.EM_ANDAMENTO,
        timeline: [...(processo.timeline || []), timelineEntryCliente]
      });

      // Atualizar o processo do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        processo.status,
        StatusProcesso.EM_ANDAMENTO,
        `Documentos aprovados`,
        "advogado",
        `Documentos do cliente foram aprovados`
      );

      atualizarProcessoAdvogado(processo.id, {
        status: StatusProcesso.EM_ANDAMENTO,
        timeline: [...(processo.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setProcesso({ ...processo, status: StatusProcesso.EM_ANDAMENTO });

      success("Documentos aprovados com sucesso!");
    } catch (err) {
      console.error("Erro ao aprovar documentos:", err);
      error("Erro ao aprovar documentos. Tente novamente.");
    }
  };

  const rejeitarDocumentos = () => {
    if (!processo) return;

    try {
      // Atualizar o processo do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aguardando_analise_documentos",
        "aguardando_documentos",
        `Documentos rejeitados pelo advogado`,
        "advogado",
        `Advogado ${processo.advogado?.nome} rejeitou os documentos. Novos documentos são necessários.`
      );

      atualizarProcessoCliente(processo.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(processo.timeline || []), timelineEntryCliente]
      });

      // Atualizar o processo do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        processo.status,
        StatusProcesso.AGUARDANDO_DADOS,
        `Documentos rejeitados`,
        "advogado",
        `Documentos foram rejeitados. Cliente deve enviar novos documentos.`
      );

      atualizarProcessoAdvogado(processo.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(processo.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setProcesso({ ...processo, status: StatusProcesso.AGUARDANDO_DADOS });

      success("Documentos rejeitados. Cliente será notificado para enviar novos documentos.");
    } catch (err) {
      console.error("Erro ao rejeitar documentos:", err);
      error("Erro ao rejeitar documentos. Tente novamente.");
    }
  };

  const protocolarProcesso = () => {
    if (!processo) return;

    try {
      // Atualizar o processo do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        processo.status,
        "protocolado",
        `Processo protocolado no fórum`,
        "advogado",
        `Advogado ${processo.advogado?.nome} protocolou o processo no fórum competente`
      );

      atualizarProcessoCliente(processo.id, {
        status: StatusProcesso.PROTOCOLADO,
        timeline: [...(processo.timeline || []), timelineEntryCliente]
      });

      // Atualizar o processo do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        processo.status,
        StatusProcesso.PROTOCOLADO,
        `Processo protocolado`,
        "advogado",
        `Processo foi protocolado no fórum competente`
      );

      atualizarProcessoAdvogado(processo.id, {
        status: StatusProcesso.PROTOCOLADO,
        timeline: [...(processo.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setProcesso({ ...processo, status: StatusProcesso.PROTOCOLADO });

      success("Processo protocolado com sucesso!");
    } catch (err) {
      console.error("Erro ao protocolar processo:", err);
      error("Erro ao protocolar processo. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Carregando processo...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!processo) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Processo não encontrado</h1>
        <p className="text-muted-foreground mb-4">Não foi possível encontrar o processo solicitado.</p>
        <Link href="/processos" className="text-primary underline">Voltar para lista de processos</Link>
      </div>
    );
  }

  return (
    <div className={`bg-background text-foreground p-8`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold`}>{processo.titulo}</h1>
          <p className="text-muted-foreground">Cliente: {processo.cliente.nome}</p>
          <p className="text-muted-foreground">Advogado: {processo.advogado?.nome}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(processo.status)}>
          {getStatusLabel(processo.status)}
        </Badge>
      </div>

      {/* Botões de ação */}
      <div className={`mb-6 flex gap-4 flex-wrap`}>
        <Button
          onClick={() => setModalSolicitarAberto(true)}
          disabled={processo.status === StatusProcesso.AGUARDANDO_DADOS || processo.status === StatusProcesso.PROTOCOLADO || processo.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS}
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Solicitar Documentos
        </Button>

        {processo.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS && processo.documentosAnexados && processo.documentosAnexados.length > 0 && (
          <>
            <Button
              onClick={aprovarDocumentos}
              className="flex items-center gap-2"
              variant="default"
            >
              <span className="text-sm">✅</span>
              Aprovar Documentos
            </Button>
            <Button
              onClick={rejeitarDocumentos}
              className="flex items-center gap-2"
              variant="destructive"
            >
              <span className="text-sm">❌</span>
              Rejeitar Documentos
            </Button>
          </>
        )}

        <Button
          onClick={protocolarProcesso}
          disabled={processo.status === StatusProcesso.PROTOCOLADO || processo.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Protocolar Processo
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VisaoGeralComponent processo={processo} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Seção de Solicitações de Documentos */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Documentos Solicitados ao Cliente</h3>
            </div>
            <DadosRequisitadosList
              processoId={processoId}
              clienteId={processo.cliente.id}
              isAdvogado={true}
            />
          </div>

          {/* Seção de Todos os Documentos */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Todos os Documentos</h3>
            </div>
            <DocumentosList
              processoId={processoId}
              isAdvogado={true}
            />
          </div>

          {/* Seção de Upload Livre (Advogado) */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Upload de Documento</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Envie documentos adicionais relacionados ao processo sem vinculá-los a uma solicitação específica.
            </p>
            <UploadDocumentoButton
              processoId={processoId}
              clienteId={processo.cliente.id}
              enviadoPorAdvogado={true}
              onUploadComplete={() => {
                // Recarregar documentos após upload
                window.location.reload();
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineComponent timeline={processo.timeline || []} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <EventosComponent processo={processo} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Chat processoId={processoId} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="client" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nome</p>
                <p className="text-muted-foreground">{processo.cliente.nome}</p>
              </div>
              <div>
                <p className="font-medium">ID do Cliente</p>
                <p className="text-muted-foreground">#{processo.cliente.id}</p>
              </div>
              <div>
                <p className="font-medium">Tipo de Processo</p>
                <p className="text-muted-foreground">{processo.tipoProcesso}</p>
              </div>
              <div>
                <p className="font-medium">Nível de Urgência</p>
                <p className="text-muted-foreground capitalize">{processo.urgencia}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Solicitação de Documentos */}
      <SolicitarDocumentoModal
        open={modalSolicitarAberto}
        onOpenChange={setModalSolicitarAberto}
        processoId={processoId}
        clienteId={processo.cliente.id}
      />
    </div>
  );
}