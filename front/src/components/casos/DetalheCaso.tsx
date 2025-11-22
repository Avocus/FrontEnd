"use client";

import { useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useCasoStore } from "@/store";
import { CasoCliente, CasoAdvogado, Evento } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Hooks customizados
import { useCasoDetalhes } from "@/hooks/useCasoDetalhes";

// Componentes compartilhados
import { StatusBadge } from "./shared/StatusBadge";
import { VisaoGeralComponent } from "./shared/VisaoGeralComponent";
import { DocumentosComponent } from "./shared/DocumentosComponent";
import { TimelineComponent } from "./shared/TimelineComponent";
import { EventosComponent } from "./shared/EventosComponent";

// Utilitários
import { getStatusLabel, getResponsavel } from "@/utils/casoUtils";

// Função utilitária para adicionar entrada no timeline
const addTimelineEntry = (
  statusAnterior: string | undefined,
  novoStatus: string,
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

// Componente para detalhes de um caso específico
export function DetalheCaso({ casoId }: { casoId: string }) {
  const { isMobile, isAdvogado } = useLayout();

  // Usar hook customizado para carregar detalhes do caso
  const { caso, loading } = useCasoDetalhes({ casoId, isAdvogado });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando...</p>
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
    <div className={`bg-background text-foreground ${isMobile ? 'p-4' : 'p-8'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{caso.titulo}</h1>
          <p className="text-muted-foreground">
            {isAdvogado ? 'Cliente' : 'Advogado'}: {getResponsavel(caso, isAdvogado)}
          </p>
        </div>
        <StatusBadge status={caso.status} isAdvogado={isAdvogado} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VisaoGeralComponent caso={caso} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentosComponent caso={caso} casoId={casoId} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineComponent timeline={caso.timeline || []} isAdvogado={isAdvogado} />
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <EventosComponent caso={caso} />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Status do Caso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Status Atual</p>
                <p className="text-muted-foreground">{getStatusLabel(caso.status, isAdvogado)}</p>
              </div>
              <div>
                <p className="font-medium">{isAdvogado ? 'Cliente' : 'Advogado'} Responsável</p>
                <p className="text-muted-foreground">{getResponsavel(caso, isAdvogado)}</p>
              </div>
              <div>
                <p className="font-medium">Nível de Urgência</p>
                <p className="text-muted-foreground capitalize">{caso.urgencia}</p>
              </div>
              <div>
                <p className="font-medium">Tipo de Processo</p>
                <p className="text-muted-foreground">{caso.tipoProcesso}</p>
              </div>
              <div>
                <p className="font-medium">{isAdvogado ? 'Cliente' : 'Cliente'}</p>
                <p className="text-muted-foreground">{caso.clienteNome}</p>
              </div>
              <div>
                <p className="font-medium">ID do Caso</p>
                <p className="text-muted-foreground">#{caso.id}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}