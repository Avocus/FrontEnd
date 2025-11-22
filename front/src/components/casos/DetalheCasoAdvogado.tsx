/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import { useCasoStore } from "@/store";
import { CasoAdvogado } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { FileText, Send } from "lucide-react";
import Link from "next/link";

// Hooks customizados
import { useCasoDetalhes } from "@/hooks/useCasoDetalhes";
import { useTimeline } from "@/hooks/useTimeline";

// Componentes compartilhados
import { VisaoGeralComponent } from "./shared/VisaoGeralComponent";
import { DocumentosComponent } from "./shared/DocumentosComponent";
import { TimelineComponent } from "./shared/TimelineComponent";
import { EventosComponent } from "./shared/EventosComponent";

// Utilitários
import { getStatusLabel, getStatusBadgeVariant } from "@/utils/casoUtils";

interface DetalheCasoAdvogadoProps {
  casoId: string;
}

export function DetalheCasoAdvogado({ casoId }: DetalheCasoAdvogadoProps) {
  const { success, error } = useToast();
  const { atualizarCasoCliente, atualizarCasoAdvogado } = useCasoStore();

  // Usar hook customizado para carregar detalhes do caso
  const { caso, loading } = useCasoDetalhes({ casoId, isAdvogado: true });

  // Hook para timeline
  const { addTimelineEntry } = useTimeline();

  const solicitarDocumentos = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aceito", // status atual do caso cliente
        "aguardando_documentos",
        `Advogado solicitou documentos adicionais`,
        "advogado",
        `Solicitação feita pelo advogado ${caso.advogadoNome}`
      );

      atualizarCasoCliente(caso.casoClienteId, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(caso.timeline || []), timelineEntryCliente]
      });

      // Atualizar o caso do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        caso.status,
        StatusProcesso.AGUARDANDO_DADOS,
        `Advogado solicitou documentos adicionais`,
        "advogado",
        `Solicitação feita pelo advogado ${caso.advogadoNome}`
      );

      atualizarCasoAdvogado(caso.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(caso.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setCaso({ ...caso, status: StatusProcesso.AGUARDANDO_DADOS });

      success("Solicitação de documentos enviada ao cliente!");
    } catch (err) {
      console.error("Erro ao solicitar documentos:", err);
      error("Erro ao solicitar documentos. Tente novamente.");
    }
  };

  const aprovarDocumentos = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aguardando_analise_documentos",
        "em_andamento",
        `Documentos aprovados pelo advogado`,
        "advogado",
        `Advogado ${caso.advogadoNome} aprovou os documentos enviados`
      );

      atualizarCasoCliente(caso.casoClienteId, {
        status: StatusProcesso.EM_ANDAMENTO,
        timeline: [...(caso.timeline || []), timelineEntryCliente]
      });

      // Atualizar o caso do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        caso.status,
        StatusProcesso.EM_ANDAMENTO,
        `Documentos aprovados`,
        "advogado",
        `Documentos do cliente foram aprovados`
      );

      atualizarCasoAdvogado(caso.id, {
        status: StatusProcesso.EM_ANDAMENTO,
        timeline: [...(caso.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setCaso({ ...caso, status: StatusProcesso.EM_ANDAMENTO });

      success("Documentos aprovados com sucesso!");
    } catch (err) {
      console.error("Erro ao aprovar documentos:", err);
      error("Erro ao aprovar documentos. Tente novamente.");
    }
  };

  const rejeitarDocumentos = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        "aguardando_analise_documentos",
        "aguardando_documentos",
        `Documentos rejeitados pelo advogado`,
        "advogado",
        `Advogado ${caso.advogadoNome} rejeitou os documentos. Novos documentos são necessários.`
      );

      atualizarCasoCliente(caso.casoClienteId, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(caso.timeline || []), timelineEntryCliente]
      });

      // Atualizar o caso do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        caso.status,
        StatusProcesso.AGUARDANDO_DADOS,
        `Documentos rejeitados`,
        "advogado",
        `Documentos foram rejeitados. Cliente deve enviar novos documentos.`
      );

      atualizarCasoAdvogado(caso.id, {
        status: StatusProcesso.AGUARDANDO_DADOS,
        timeline: [...(caso.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setCaso({ ...caso, status: StatusProcesso.AGUARDANDO_DADOS });

      success("Documentos rejeitados. Cliente será notificado para enviar novos documentos.");
    } catch (err) {
      console.error("Erro ao rejeitar documentos:", err);
      error("Erro ao rejeitar documentos. Tente novamente.");
    }
  };

  const protocolarCaso = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        caso.status,
        "protocolado",
        `Caso protocolado no fórum`,
        "advogado",
        `Advogado ${caso.advogadoNome} protocolou o caso no fórum competente`
      );

      atualizarCasoCliente(caso.casoClienteId, {
        status: StatusProcesso.PROTOCOLADO,
        timeline: [...(caso.timeline || []), timelineEntryCliente]
      });

      // Atualizar o caso do advogado na store
      const timelineEntryAdvogado = addTimelineEntry(
        caso.status,
        StatusProcesso.PROTOCOLADO,
        `Caso protocolado`,
        "advogado",
        `Caso foi protocolado no fórum competente`
      );

      atualizarCasoAdvogado(caso.id, {
        status: StatusProcesso.PROTOCOLADO,
        timeline: [...(caso.timeline || []), timelineEntryAdvogado]
      });

      // Atualizar o estado local
      setCaso({ ...caso, status: StatusProcesso.PROTOCOLADO });

      success("Caso protocolado com sucesso!");
    } catch (err) {
      console.error("Erro ao protocolar caso:", err);
      error("Erro ao protocolar caso. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Carregando caso...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Caso não encontrado</h1>
        <p className="text-muted-foreground mb-4">Não foi possível encontrar o caso solicitado.</p>
        <Link href="/casos" className="text-primary underline">Voltar para lista de casos</Link>
      </div>
    );
  }

  return (
    <div className={`bg-background text-foreground p-8`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-3xl font-bold`}>{caso.titulo}</h1>
          <p className="text-muted-foreground">Cliente: {caso.clienteNome}</p>
          <p className="text-muted-foreground">Advogado: {caso.advogadoNome}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(caso.status)}>
          {getStatusLabel(caso.status)}
        </Badge>
      </div>

      {/* Botões de ação */}
      <div className={`mb-6 flex gap-4 flex-wrap`}>
        <Button
          onClick={solicitarDocumentos}
          disabled={caso.status === StatusProcesso.AGUARDANDO_DADOS || caso.status === StatusProcesso.PROTOCOLADO || caso.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS}
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Solicitar Documentos
        </Button>

        {caso.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS && caso.documentosAnexados && caso.documentosAnexados.length > 0 && (
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
          onClick={protocolarCaso}
          disabled={caso.status === StatusProcesso.PROTOCOLADO || caso.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Protocolar Caso
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VisaoGeralComponent caso={caso} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentosComponent caso={caso} casoId={casoId} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineComponent timeline={caso.timeline || []} isAdvogado={true} />
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <EventosComponent caso={caso} />
        </TabsContent>

        <TabsContent value="client" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nome</p>
                <p className="text-muted-foreground">{caso.clienteNome}</p>
              </div>
              <div>
                <p className="font-medium">ID do Cliente</p>
                <p className="text-muted-foreground">#{caso.clienteId}</p>
              </div>
              <div>
                <p className="font-medium">Tipo de Processo</p>
                <p className="text-muted-foreground">{caso.tipoProcesso}</p>
              </div>
              <div>
                <p className="font-medium">Nível de Urgência</p>
                <p className="text-muted-foreground capitalize">{caso.urgencia}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}