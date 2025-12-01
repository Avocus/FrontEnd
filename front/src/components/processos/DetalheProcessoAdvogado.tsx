/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/useToast";
import { useProcessoStore } from "@/store";
import { ProcessoAdvogado } from "@/types/entities";
import { getStatusProcessoLabel, getStatusUrgenciaLabel, StatusProcesso } from "@/types/enums";
import { FileText, Send } from "lucide-react";
import Link from "next/link";

// Hooks customizados
import { useProcessoDetalhes } from "@/hooks/useProcessoDetalhes";
import { useTimeline } from "@/hooks/useTimeline";
import { useProcessosDisponiveis } from "@/hooks/useProcessosDisponiveis";

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
import { StatusBadge } from "./shared/StatusBadge";

// Utilitários
import { getStatusLabel } from "@/utils/processoUtils";
import { atualizarStatusProcesso } from "@/services/processo/processoService";

interface DetalheProcessoAdvogadoProps {
  processoId: string;
}

export function DetalheProcessoAdvogado({ processoId }: DetalheProcessoAdvogadoProps) {
  const { success, error } = useToast();
  const { atualizarProcessoCliente, atualizarProcessoAdvogado } = useProcessoStore();

  // Usar hook customizado para carregar detalhes do processo
  const { processo, setProcesso, loading, refetch } = useProcessoDetalhes({ processoId, isAdvogado: true });

  // Hook para timeline
  const { addTimelineEntry } = useTimeline();
  const [modalSolicitarAberto, setModalSolicitarAberto] = useState(false);

  // Hook para processos disponíveis
  const { assignProcesso } = useProcessosDisponiveis();

  const solicitarDocumentos = () => {
    if (!processo) return;

    try {
      // Atualizar o processo do cliente na store
      const timelineEntryCliente = addTimelineEntry(
        StatusProcesso.ACEITO, // status atual do processo cliente
        StatusProcesso.AGUARDANDO_DADOS,
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
        StatusProcesso.AGUARDANDO_ANALISE_DADOS,
        StatusProcesso.EM_ANDAMENTO,
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
        StatusProcesso.AGUARDANDO_ANALISE_DADOS,
        StatusProcesso.AGUARDANDO_DADOS,
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
    // agora abrimos modal de seleção de status (implementado abaixo)
    setStatusModalOpen(true);
  };

  // Modal e lógica para seleção de status
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusProcesso | null>(null);
  const [statusDescription, setStatusDescription] = useState("");

  const possibleStatuses: StatusProcesso[] = Object.values(StatusProcesso).filter(
    (s) => s !== processo?.status
  ) as StatusProcesso[];

  const performStatusChange = async (newStatus: StatusProcesso, description: string) => {
    if (!processo) return;

    try {
      // Chamar API para atualizar status
      const updatedProcesso = await atualizarStatusProcesso(processo.id.toString(), newStatus, description);

      // Mapear o ProcessoDTO retornado para ProcessoAdvogado
      const timelineMapeada = updatedProcesso.linhaDoTempo ? updatedProcesso.linhaDoTempo.map(update => ({
        id: update.id.toString(),
        data: update.dataAtualizacao,
        statusAnterior: update.statusAnterior,
        novoStatus: update.novoStatus,
        descricao: update.descricao,
        autor: "advogado" as const,
        observacoes: undefined
      })) : [];

      // Atualizar o estado local com os dados mapeados corretamente
      setProcesso({
        ...processo,
        status: updatedProcesso.status,
        timeline: timelineMapeada
      });

      // Atualizar a store
      atualizarProcessoAdvogado(processo.id.toString(), {
        status: newStatus,
        timeline: timelineMapeada
      });

      // Fechar modal e limpar estados
      setStatusModalOpen(false);
      setSelectedStatus(null);
      setStatusDescription("");

      success(`Status alterado para ${getStatusProcessoLabel(newStatus)} com sucesso!`);
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      error("Erro ao alterar status. Tente novamente.");
    }
  };

  const aceitarProcesso = async () => {
    if (!processo) return;
    try {
      // 1) Solicitar ao backend para atualizar o status para PENDENTE
      await atualizarStatusProcesso(processo.id.toString(), StatusProcesso.PENDENTE, 'Marcado como pendente antes da atribuição');

      // Recarregar os dados do processo e forçar reload da página conforme solicitado
      await refetch();
      if (typeof window !== 'undefined') {
        window.location.reload();
      }

      success('Processo marcado como pendente. Confirme sua escolha ou desista do processo.');
    } catch (err) {
      console.error("Erro ao aceitar processo:", err);
      // Não tentar assign se houve erro na atualização de status ou na atribuição
      error("Erro ao aceitar processo. Tente novamente.");
    }
  };

  const confirmarEscolhaProcesso = async () => {
    if (!processo) return;

    try {
      await assignProcesso(processo.id);
      await refetch();
      success('Processo atribuído com sucesso!');
    } catch (err) {
      console.error('Erro ao confirmar escolha do processo:', err);
      error('Erro ao confirmar escolha do processo. Tente novamente.');
    }
  };

  const desistirProcesso = async () => {
    if (!processo) return;

    try {
      await atualizarStatusProcesso(processo.id.toString(), StatusProcesso.RASCUNHO, 'Advogado desistiu do processo');
      await refetch();
      success('Você desistiu do processo. Status revertido para rascunho.');
    } catch (err) {
      console.error('Erro ao desistir do processo:', err);
      error('Erro ao desistir do processo. Tente novamente.');
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
        <StatusBadge status={processo.status} isAdvogado={true} />
      </div>

      {/* Botões de ação */}
      <div className={`mb-6 flex gap-4 flex-wrap`}>
        {processo.advogado ? (
          // Botões para processos que já têm advogado atribuído
          <>
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
          </>
        ) : (
          // Processo disponível: dependendo do status mostramos ações diferentes
          (() => {
            if (processo.status === StatusProcesso.PENDENTE) {
              // Se já está pendente, oferecer confirmar ou desistir
              return (
                <div className="flex gap-2">
                  <Button onClick={confirmarEscolhaProcesso} className="flex items-center gap-2" variant="primary">
                    <span className="text-sm">✅</span>
                    Confirmar escolha de caso
                  </Button>
                  <Button onClick={desistirProcesso} className="flex items-center gap-2" variant="secondary">
                    <span className="text-sm">❌</span>
                    Desistir do processo
                  </Button>
                </div>
              );
            }

            // Botão padrão para marcar como pendente (inicia fluxo)
            return (
              <Button
                onClick={aceitarProcesso}
                className="flex items-center gap-2"
                variant="primary"
              >
                <span className="text-sm">🎯</span>
                Pegar Caso
              </Button>
            );
          })()
        )}

        {processo.status !== StatusProcesso.RASCUNHO && processo.status !== StatusProcesso.PENDENTE &&(
          <Button
            onClick={protocolarProcesso}
            disabled={processo.status === StatusProcesso.PROTOCOLADO || processo.status === StatusProcesso.AGUARDANDO_ANALISE_DADOS}
            variant="primary" size="sm" className="bg-primary hover:bg-secondary"
          >
            <Send className="h-4 w-4" />
            Trocar Status do Processo
          </Button>
        )}

      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full ${processo.advogado ? 'grid-cols-6' : 'grid-cols-3'}`}>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          {processo.advogado && (
            <>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="timeline">Andamentos</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </>
          )}
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <VisaoGeralComponent processo={processo} isAdvogado={true} />
        </TabsContent>

        {processo.advogado && (
          <>
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
                  onStatusChange={refetch}
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
                  onStatusChange={refetch}
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
          </>
        )}

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
                <p className="text-muted-foreground capitalize">{getStatusUrgenciaLabel(processo.urgencia)}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {/* Modal de seleção de status (avançar/mudar status do processo) */}
      <Dialog open={statusModalOpen} onOpenChange={(open) => { setStatusModalOpen(open); if (open) { setSelectedStatus(possibleStatuses[0] || null); setStatusDescription(""); } else { setSelectedStatus(null); setStatusDescription(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Alterar status do processo</DialogTitle>
            <DialogDescription>
              Selecione o novo status para o processo. Isso criará um novo registro na timeline e notificará as partes conforme configurado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">Status atual: <strong>{getStatusProcessoLabel(processo.status)}</strong></p>

            <Select value={selectedStatus ?? undefined} onValueChange={(value) => setSelectedStatus(value as StatusProcesso)}>
              <SelectTrigger>
                <SelectValue>{selectedStatus ? getStatusProcessoLabel(selectedStatus) : 'Escolha um status'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {possibleStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{getStatusProcessoLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label htmlFor="status-description" className="block text-sm font-medium mb-2">
                Descrição da alteração (opcional)
              </label>
              <Textarea
                id="status-description"
                placeholder="Descreva o motivo da alteração de status..."
                value={statusDescription}
                onChange={(e) => setStatusDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setStatusModalOpen(false); setSelectedStatus(null); }}>
              Cancelar
            </Button>
            <Button variant={"primary"} onClick={() => selectedStatus && performStatusChange(selectedStatus, statusDescription)} disabled={!selectedStatus}>
              Confirmar alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Solicitação de Documentos */}
      <SolicitarDocumentoModal
        open={modalSolicitarAberto}
        onOpenChange={setModalSolicitarAberto}
        processoId={processoId}
        clienteId={processo.cliente.id}
        onStatusChange={refetch}
      />
    </div>
  );
}