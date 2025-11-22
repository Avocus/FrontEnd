"use client";

import { useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useCasoStore } from "@/store";
import { useToast } from "@/hooks/useToast";
import { CasoCliente, CasoAdvogado, DocumentoAnexado, TimelineEntry } from "@/types/entities";
import { StatusCaso } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Send } from "lucide-react";
import Link from "next/link";

// Função utilitária para obter label do status
const getStatusLabel = (status: CasoCliente["status"] | CasoAdvogado["status"]) => {
  const labels = {
    pendente: "Pendente",
    em_analise: "Em Análise",
    aceito: "Aceito",
    rejeitado: "Rejeitado",
    aguardando_documentos: "Aguardando Documentos",
    documentos_enviados: "Documentos Enviados",
    aguardando_analise_documentos: "Aguardando Análise de Documentos",
    em_andamento: "Em Andamento",
    protocolado: "Protocolado",
    // Status específicos de advogado
    concluido: "Concluído",
    arquivado: "Arquivado",
    esperando_documentos: "Esperando Documentos"
  };
  return labels[status] || status;
};

// Função utilitária para verificar se cliente pode modificar documentos
const podeModificarDocumentos = (status: CasoCliente["status"], isAdvogado: boolean) => {
  if (isAdvogado) return false; // Advogados não modificam documentos aqui
  // Cliente pode modificar documentos apenas em determinados status
  const statusPermitidos = [
    StatusCaso.ACEITO,
    StatusCaso.AGUARDANDO_DOCUMENTOS
  ];
  return statusPermitidos.includes(status as StatusCaso);
};

// Função utilitária para verificar se cliente pode visualizar opções de documento
const podeGerenciarDocumentos = (status: CasoCliente["status"], isAdvogado: boolean) => {
  if (isAdvogado) return true; // Advogados sempre podem ver documentos
  // Cliente pode ver opções de documento (mas talvez com restrições)
  const statusPermitidos = [
    StatusCaso.ACEITO,
    StatusCaso.AGUARDANDO_DOCUMENTOS,
    StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
  ];
  return statusPermitidos.includes(status as StatusCaso);
};

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

// Função utilitária para obter responsável
const getResponsavel = (caso: CasoCliente | CasoAdvogado, isAdvogado: boolean) => {
  if (isAdvogado) {
    // Para advogados, mostrar o cliente
    return caso.clienteNome;
  } else {
    // Para clientes, mostrar o advogado
    if ((caso as CasoCliente).status === StatusCaso.PENDENTE) {
      return "Relacionando com advogado";
    } else if ((caso as CasoCliente).status === StatusCaso.EM_ANALISE) {
      return "Em análise...";
    } else {
      return (caso as CasoCliente).advogadoNome || 'Advogado não definido';
    }
  }
};

// Componente para detalhes de um caso específico
export function DetalheCaso({ casoId }: { casoId: string }) {
  const { isMobile, isAdvogado } = useLayout();
  const { casosCliente, casosAdvogado, atualizarCasoCliente, atualizarCasoAdvogado } = useCasoStore();
  const { success: showSuccess, error: showError } = useToast();

  const [modalAberto, setModalAberto] = useState(false);
  const [documentosParaEnvio, setDocumentosParaEnvio] = useState<File[]>([]);
  const [enviandoDocumentos, setEnviandoDocumentos] = useState(false);

  // Encontrar o caso baseado no tipo de usuário
  const caso = isAdvogado
    ? casosAdvogado.find((c) => c.id === casoId)
    : casosCliente.find((c) => c.id === casoId);

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Função para adicionar arquivos
  const adicionarArquivos = (files: FileList | null) => {
    if (!files) return;

    const novosArquivos = Array.from(files).filter(file => {
      // Verificar se já não existe um arquivo com o mesmo nome
      return !documentosParaEnvio.some(doc => doc.name === file.name);
    });

    setDocumentosParaEnvio(prev => [...prev, ...novosArquivos]);
  };

  // Função para remover arquivo
  const removerArquivo = (index: number) => {
    setDocumentosParaEnvio(prev => prev.filter((_, i) => i !== index));
  };

  // Função para remover documento já enviado
  const removerDocumentoEnviado = async (documentoId: string) => {
    try {
      if (isAdvogado) {
        // Para advogados, atualizar casoAdvogado
        const casoAtual = casosAdvogado.find(c => c.id === casoId);
        if (!casoAtual) return;

        const documentosAtualizados = (casoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarCasoAdvogado(casoId, {
          documentosAnexados: documentosAtualizados
        });
      } else {
        // Para clientes, atualizar casoCliente
        const casoAtual = casosCliente.find(c => c.id === casoId);
        if (!casoAtual) return;

        const documentosAtualizados = (casoAtual.documentosAnexados || []).filter(doc => doc.id !== documentoId);
        atualizarCasoCliente(casoId, {
          documentosAnexados: documentosAtualizados
        });
      }

      showSuccess("Documento removido com sucesso!");

    } catch (error) {
      console.error("Erro ao remover documento:", error);
      showError("Erro ao remover documento. Tente novamente.");
    }
  };

  // Função para enviar todos os documentos
  const enviarTodosDocumentos = async () => {
    if (documentosParaEnvio.length === 0) {
      showError("Selecione ao menos um documento para enviar");
      return;
    }

    setEnviandoDocumentos(true);

    try {
      // Converter todos os arquivos para base64
      const documentosConvertidos: DocumentoAnexado[] = await Promise.all(
        documentosParaEnvio.map(async (file, index) => {
          const conteudoBase64 = await fileToBase64(file);
          return {
            id: `doc-${Date.now()}-${index}`,
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            dataEnvio: new Date().toISOString(),
            conteudo: conteudoBase64
          };
        })
      );

      if (isAdvogado) {
        // Para advogados, atualizar casoAdvogado
        const casoAtual = casosAdvogado.find(c => c.id === casoId);
        if (!casoAtual) {
          showError("Caso não encontrado");
          return;
        }

        atualizarCasoAdvogado(casoId, {
          documentosAnexados: [...(casoAtual.documentosAnexados || []), ...documentosConvertidos]
        });
      } else {
        // Para clientes, atualizar casoCliente
        const casoAtual = casosCliente.find(c => c.id === casoId);
        if (!casoAtual) {
          showError("Caso não encontrado");
          return;
        }

        // Atualizar o caso na store
        const timelineEntry = addTimelineEntry(
          casoAtual.status,
          StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS,
          `Cliente enviou ${documentosParaEnvio.length} documento(s) para análise`,
          "cliente",
          `Documentos: ${documentosParaEnvio.map(f => f.name).join(", ")}`
        );

        atualizarCasoCliente(casoId, {
          status: StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS,
          documentosAnexados: [...(casoAtual.documentosAnexados || []), ...documentosConvertidos],
          timeline: [...(casoAtual.timeline || []), timelineEntry]
        });

        // Também atualizar o caso no store dos advogados (se existir)
        // Como não temos acesso direto ao store dos advogados aqui, vamos usar um evento
        window.dispatchEvent(new CustomEvent("casoClienteUpdated", {
          detail: {
            casoId,
            updates: {
              status: "aguardando_analise_documentos",
              documentosAnexados: documentosConvertidos,
              timeline: timelineEntry
            }
          }
        }));
      }

      showSuccess(`${documentosParaEnvio.length} documento(s) enviado(s) com sucesso!`);
      setModalAberto(false);
      setDocumentosParaEnvio([]);

    } catch (error) {
      console.error("Erro ao enviar documentos:", error);
      showError("Erro ao enviar documentos. Tente novamente.");
    } finally {
      setEnviandoDocumentos(false);
    }
  };

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
        <Badge variant={caso.status === StatusCaso.ACEITO ? "default" : "secondary"}>
          {getStatusLabel(caso.status)}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Seção de Ações Necessárias - específica para clientes */}
          {!isAdvogado && (caso as CasoCliente).status && (
            <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <h2 className="text-xl font-semibold mb-3 text-green-900 dark:text-green-100">📋 O que você precisa fazer</h2>
              <div className="space-y-2">
                {(caso as CasoCliente).status === StatusCaso.PENDENTE && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Aguardando:</strong> Seu caso está na fila de análise. Um advogado irá avaliar e aceitar seu caso em breve.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.EM_ANALISE && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Em análise:</strong> Um advogado está analisando seu caso. Você será notificado quando houver uma decisão.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.ACEITO && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Caso aceito:</strong> Seu caso foi aceito por um advogado. Aguarde instruções ou solicitação de documentos.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.AGUARDANDO_DOCUMENTOS && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Ação necessária:</strong> O advogado solicitou documentos. Acesse a aba &quot;Documentos&quot; e envie os arquivos necessários.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Documentos em análise:</strong> Você enviou {(caso as CasoCliente).documentosAnexados?.length || 0} documento(s). O advogado está analisando. Aguarde aprovação.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.DOCUMENTOS_ENVIADOS && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Documentos enviados:</strong> Seus documentos foram enviados. O advogado irá analisá-los em breve.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.EM_ANDAMENTO && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Caso em andamento:</strong> Seus documentos foram aprovados. O advogado está trabalhando no seu caso.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.PROTOCOLADO && (
                  <p className="text-sm text-green-800 dark:text-green-200">
                    • <strong>Protocolado:</strong> Seu caso foi enviado ao fórum competente. Acompanhe os andamentos processuais.
                  </p>
                )}
                {(caso as CasoCliente).status === StatusCaso.REJEITADO && (
                  <p className="text-sm text-red-800 dark:text-red-200">
                    • <strong>Caso rejeitado:</strong> Infelizmente seu caso foi rejeitado. Entre em contato para mais informações.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Informações do Caso</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {getStatusLabel(caso.status)}</p>
                <p><span className="font-medium">Data de Solicitação:</span> {new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                <p><span className="font-medium">Tipo de Processo:</span> {caso.tipoProcesso}</p>
                <p><span className="font-medium">Urgência:</span> {caso.urgencia}</p>
                <p><span className="font-medium">Descrição:</span> {caso.descricao}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Situação Atual</h2>
              <p className="text-sm text-muted-foreground mb-4">{caso.situacaoAtual}</p>

              <h3 className="font-medium mb-2">Objetivos</h3>
              <p className="text-sm text-muted-foreground mb-4">{caso.objetivos}</p>

              {(caso as CasoCliente).documentosDisponiveis && (
                <>
                  <h3 className="font-medium mb-2">Documentos Disponíveis</h3>
                  <p className="text-sm text-muted-foreground">{(caso as CasoCliente).documentosDisponiveis}</p>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Aviso quando documentos estão em análise - apenas para clientes */}
          {!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-sm">⏳</span>
                </div>
                <div>
                  <h3 className="font-medium text-amber-900 dark:text-amber-100">Documentos em Análise</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                    Seus documentos estão sendo analisados pelo advogado. Durante este período, não é possível adicionar ou remover documentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Documentos do Processo</h2>
              {podeGerenciarDocumentos(caso.status, isAdvogado) && (
                <Button
                  onClick={() => setModalAberto(true)}
                  className="flex items-center gap-2"
                  disabled={!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS}
                  variant={!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS ? "outline" : "default"}
                >
                  <Upload className="h-4 w-4" />
                  {!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                    ? "Documentos em Análise"
                    : "Enviar Documentos"
                  }
                </Button>
              )}
            </div>

            {/* Documentos solicitados - apenas para clientes */}
            {!isAdvogado && (caso as CasoCliente).documentosDisponiveis && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Documentos Solicitados:</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{(caso as CasoCliente).documentosDisponiveis}</p>
                </div>
              </div>
            )}

            {/* Documentos já enviados */}
            {caso.documentosAnexados && caso.documentosAnexados.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Documentos Enviados ({caso.documentosAnexados.length})</h3>
                  <Badge variant="secondary" className="text-xs">
                    {!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS ? "Em análise" : "Processado"}
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {caso.documentosAnexados.map((doc, index) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{doc.nome}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{doc.tipo || 'Tipo desconhecido'}</span>
                            <span>•</span>
                            <span>{(doc.tamanho / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>
                              {new Date(doc.dataEnvio).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Criar link para download
                            const link = document.createElement('a');
                            link.href = doc.conteudo;
                            link.download = doc.nome;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="h-8 px-2"
                        >
                          <span className="text-xs">Baixar</span>
                        </Button>
                        {podeModificarDocumentos(caso.status, isAdvogado) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja remover o documento "${doc.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
                                removerDocumentoEnviado(doc.id);
                              }
                            }}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Remover documento"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                        {!podeModificarDocumentos(caso.status, isAdvogado) && !isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS && (
                          <Badge variant="secondary" className="text-xs">
                            Em análise
                          </Badge>
                        )}
                        <Badge
                          variant={!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS ? "default" : "outline"}
                          className="text-xs"
                        >
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo dos documentos */}
                <div className={`mt-4 p-3 rounded-lg border ${
                  !isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                    : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className={`h-4 w-4 ${
                      !isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`} />
                    <span className={`font-medium ${
                      !isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                        ? "text-amber-900 dark:text-amber-100"
                        : "text-blue-900 dark:text-blue-100"
                    }`}>
                      Total: {caso.documentosAnexados.length} documento(s) enviado(s)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${
                    !isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                      ? "text-amber-700 dark:text-amber-200"
                      : "text-blue-700 dark:text-blue-200"
                  }`}>
                    {!isAdvogado && (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                      ? "📋 Documentos em análise pelo advogado responsável. Modificações bloqueadas temporariamente."
                      : "✅ Documentos processados com sucesso"
                    }
                  </p>
                </div>
              </div>
            )}

            {(!caso.documentosAnexados || caso.documentosAnexados.length === 0) && (
              <p className="text-muted-foreground text-center py-8">
                Nenhum documento informado para este caso.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Andamentos do Processo</h2>
            <div className="space-y-4">
              {/* Timeline baseado no array de timeline do caso */}
              {caso.timeline && caso.timeline.length > 0 ? (
                <div className="space-y-6">
                  {[...caso.timeline].reverse().map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.autor === "cliente" ? "bg-blue-500" :
                          entry.autor === "advogado" ? "bg-green-500" : "bg-gray-500"
                        }`}></div>
                        {index < caso.timeline!.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(entry.data).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.autor === "cliente" ? "bg-blue-100 text-blue-800" :
                            entry.autor === "advogado" ? "bg-green-100 text-green-800" : 
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {entry.autor === "cliente" ? "Cliente" : 
                             entry.autor === "advogado" ? "Advogado" : "Sistema"}
                          </span>
                        </div>
                        <p className="font-medium mb-1">{entry.descricao}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {entry.statusAnterior ? `${getStatusLabel(entry.statusAnterior as StatusCaso)} → ` : ""}{getStatusLabel(entry.novoStatus as StatusCaso)}
                        </p>
                        {entry.observacoes && (
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            {entry.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Timeline padrão quando não há entradas específicas */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        {new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="font-medium">Caso solicitado</p>
                      <p className="text-sm text-muted-foreground">Solicitação de caso enviada com sucesso</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Status do Caso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Status Atual</p>
                <p className="text-muted-foreground">{getStatusLabel(caso.status)}</p>
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

      {/* Modal para envio de documentos */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAdvogado ? "Gerenciar Documentos" :
                (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                ? "Documentos em Análise"
                : "Enviar Documentos"
              }
            </DialogTitle>
            <DialogDescription>
              {isAdvogado ? "Gerencie os documentos deste caso." :
                (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS
                ? "Os documentos enviados estão sendo analisados pelo advogado. Você não pode modificar documentos neste momento."
                : "Selecione os documentos que deseja enviar para este caso. Todos os documentos serão anexados ao processo."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input para seleção de arquivos */}
            {podeModificarDocumentos(caso.status, isAdvogado) ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => adicionarArquivos(e.target.files)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Clique para selecionar arquivos</p>
                  <p className="text-xs text-muted-foreground">
                    Suporte a PDF, DOC, DOCX, JPG, PNG, TXT
                  </p>
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-lg p-6 text-center opacity-50">
                <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium mb-1 text-gray-500">
                  {isAdvogado ? "Gerenciamento bloqueado" : "Envio de documentos bloqueado"}
                </p>
                <p className="text-xs text-gray-400">
                  {isAdvogado ? "Função não disponível para advogados aqui" : "Os documentos estão sendo analisados pelo advogado"}
                </p>
              </div>
            )}

            {/* Lista de arquivos selecionados */}
            {documentosParaEnvio.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Arquivos Selecionados ({documentosParaEnvio.length})</h3>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {documentosParaEnvio.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerArquivo(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos solicitados (referência) - apenas para clientes */}
            {!isAdvogado && (caso as CasoCliente).documentosDisponiveis && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1">Documentos Solicitados:</h4>
                <p className="text-xs text-muted-foreground">{(caso as CasoCliente).documentosDisponiveis}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setModalAberto(false);
                setDocumentosParaEnvio([]);
              }}
            >
              {isAdvogado ? "Fechar" :
                (caso as CasoCliente).status === StatusCaso.AGUARDANDO_ANALISE_DOCUMENTOS ? "Fechar" : "Cancelar"}
            </Button>
            {podeModificarDocumentos(caso.status, isAdvogado) && (
              <Button
                onClick={enviarTodosDocumentos}
                disabled={documentosParaEnvio.length === 0 || enviandoDocumentos}
                className="flex items-center gap-2"
              >
                {enviandoDocumentos ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar {documentosParaEnvio.length > 0 ? `${documentosParaEnvio.length} documento(s)` : 'Documentos'}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}