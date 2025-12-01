"use client";

import { useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useProcessoStore } from "@/store";
import { ProcessoCliente, ProcessoAdvogado, Evento, TimelineEntry } from "@/types/entities";
import { getStatusUrgenciaLabel, StatusProcesso } from "@/types/enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Definição do tipo TimelineEntry
// interface TimelineEntry {
//   id: string;
//   data: string;
//   statusAnterior?: string;
//   novoStatus: string;
//   descricao: string;
//   autor: "cliente" | "advogado" | "sistema";
//   observacoes?: string;
// }

// Hooks customizados
import { useProcessoDetalhes } from "@/hooks/useProcessoDetalhes";

// Componentes compartilhados
import { StatusBadge } from "./shared/StatusBadge";
import { VisaoGeralComponent } from "./shared/VisaoGeralComponent";
import { DocumentosComponent } from "./shared/DocumentosComponent";
import { TimelineComponent } from "./shared/TimelineComponent";
import { EventosComponent } from "./shared/EventosComponent";
import Chat from "./shared/Chat";
import { DadosRequisitadosList } from "./DadosRequisitadosList";
import { DocumentosList } from "./DocumentosList";
import { IAProcessoTab } from "./IAProcessoTab";

// Utilitários
import { getStatusLabel, getResponsavel } from "@/utils/processoUtils";

// Função utilitária para adicionar entrada no timeline
const addTimelineEntry = (
  statusAnterior: StatusProcesso | undefined,
  novoStatus: StatusProcesso,
  descricao: string,
  autor: "cliente" | "advogado" | "sistema",
  observacoes?: string
): TimelineEntry => {
  return {
    id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    data: new Date().toISOString(),
    statusAnterior,
    novoStatus,
    descricao,
    autor,
    observacoes
  };
};

// Componente para detalhes de um processo específico
export function DetalheProcesso({ processoId }: { processoId: string }) {
  const { isMobile, isAdvogado } = useLayout();

  // Usar hook customizado para carregar detalhes do processo
  const { processo, loading, refetch } = useProcessoDetalhes({ processoId, isAdvogado });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando...</p>
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
    <div className={`bg-background text-foreground ${isMobile ? 'p-4' : 'p-8'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{processo.titulo}</h1>
          <p className="text-muted-foreground">
            {isAdvogado ? 'Cliente' : 'Advogado'}: {getResponsavel(processo, isAdvogado)}
          </p>
        </div>
        <StatusBadge status={processo.status} isAdvogado={isAdvogado} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="ia" className="text-purple-600">✨ IA</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VisaoGeralComponent processo={processo} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Seção de Documentos Solicitados (Pendentes) */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Documentos Pendentes</h3>
            </div>
            <DadosRequisitadosList
              processoId={processoId}
              clienteId={processo.cliente.id}
              isAdvogado={false}
              onStatusChange={refetch}
            />
          </div>

          {/* Seção de Meus Documentos */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Meus Documentos</h3>
            </div>
            <DocumentosList
              processoId={processoId}
              clienteId={processo.cliente.id}
              isAdvogado={false}
              onStatusChange={refetch}
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineComponent timeline={processo.timeline || []} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <EventosComponent processo={processo} />
        </TabsContent>

        <TabsContent value="ia" className="space-y-4">
          <IAProcessoTab 
            processo={processo as ProcessoAdvogado}
            documentos={processo.documentosAnexados?.map(doc => ({
              id: doc.id || '',
              nome: doc.nome || doc.nomeArquivo || 'Documento',
              url: doc.url || '',
              conteudo: undefined
            })) || []}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Chat processoId={processoId} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Status do Processo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Status Atual</p>
                <p className="text-muted-foreground">{getStatusLabel(processo.status)}</p>
              </div>
              <div>
                <p className="font-medium">{isAdvogado ? 'Cliente' : 'Advogado'} Responsável</p>
                <p className="text-muted-foreground">{getResponsavel(processo, isAdvogado)}</p>
              </div>
              <div>
                <p className="font-medium">Nível de Urgência</p>
                <p className="text-muted-foreground capitalize">{getStatusUrgenciaLabel(processo.urgencia)}</p>
              </div>
              <div>
                <p className="font-medium">Tipo de Processo</p>
                <p className="text-muted-foreground">{processo.tipoProcesso}</p>
              </div>
              <div>
                <p className="font-medium">{isAdvogado ? 'Cliente' : 'Cliente'}</p>
                <p className="text-muted-foreground">{processo.cliente.nome}</p>
              </div>
              <div>
                <p className="font-medium">ID do Processo</p>
                <p className="text-muted-foreground">#{processo.id}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}