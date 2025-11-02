/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Grid, List, Calendar, User, AlertCircle, CheckCircle, XCircle, FileText, Send } from "lucide-react";
import { TipoProcesso } from "@/types/enums";
import { useAuthStore } from "@/store";
import { useToast } from "@/hooks/useToast";

// Interface para casos do cliente
interface CasoCliente {
  id: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  status: "pendente" | "em_analise" | "aceito" | "rejeitado" | "aguardando_documentos" | "protocolado";
  advogadoId?: string;
  advogadoNome?: string;
  timeline?: TimelineEntry[];
}

// Interface para documentos anexados
interface DocumentoAnexado {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataEnvio: string;
  conteudo: string; // Base64 do arquivo
}

// Interface para entradas do timeline
interface TimelineEntry {
  id: string;
  data: string;
  statusAnterior?: string;
  novoStatus: string;
  descricao: string;
  autor: "cliente" | "advogado" | "sistema";
  observacoes?: string;
}

// Interface para casos do advogado
interface CasoAdvogado {
  id: string;
  casoClienteId: string;
  advogadoId: string;
  advogadoNome: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  tipoProcesso: TipoProcesso;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  dataAceite: string;
  status: "aceito" | "em_andamento" | "concluido" | "arquivado" | "esperando_documentos" | "aguardando_analise_documentos" | "protocolado";
  documentosAnexados?: DocumentoAnexado[];
  timeline?: TimelineEntry[];
}

// Hook para carregar casos pendentes do localStorage
function useCasosPendentes() {
  const [casosPendentes, setCasosPendentes] = useState<CasoCliente[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCasosPendentes = useCallback(() => {
    try {
      const casosExistentes = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const pendentes = casosExistentes.filter((caso: CasoCliente) => caso.status === "pendente");
      setCasosPendentes(pendentes);
    } catch (error) {
      console.error("Erro ao carregar casos pendentes:", error);
      setCasosPendentes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCasosPendentes();
  }, [carregarCasosPendentes]);

  return { casosPendentes, loading, recarregar: carregarCasosPendentes };
}

// Hook para carregar casos do advogado do localStorage
function useCasosAdvogado() {
  const [casosAdvogado, setCasosAdvogado] = useState<CasoAdvogado[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const carregarCasosAdvogado = useCallback(() => {
    if (!user) return;

    try {
      const casosExistentes = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const casosDoAdvogado = casosExistentes;
      setCasosAdvogado(casosDoAdvogado);
    } catch (error) {
      console.error("Erro ao carregar casos do advogado:", error);
      setCasosAdvogado([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    carregarCasosAdvogado();
  }, [carregarCasosAdvogado]);

  return { casosAdvogado, loading, recarregar: carregarCasosAdvogado };
}

// Função para obter label do status do advogado
const getStatusLabel = (status: CasoAdvogado["status"]) => {
  const labels = {
    aceito: "Aceito",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    arquivado: "Arquivado",
    esperando_documentos: "Esperando Documentos",
    aguardando_analise_documentos: "Aguardando Análise de Documentos",
    protocolado: "Protocolado"
  };
  return labels[status] || status;
};

// Função para obter cor do badge baseado no status
const getStatusBadgeVariant = (status: CasoAdvogado["status"]) => {
  const variants = {
    aceito: "default" as const,
    em_andamento: "secondary" as const,
    concluido: "outline" as const,
    arquivado: "destructive" as const,
    esperando_documentos: "secondary" as const,
    aguardando_analise_documentos: "default" as const,
    protocolado: "default" as const
  };
  return variants[status] || "outline";
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

// Modal para aceitar/declinar caso
function ModalCasoPendente({ 
  caso, 
  isOpen, 
  onClose, 
  onAceitar, 
  onDeclinar 
}: { 
  caso: CasoCliente | null;
  isOpen: boolean;
  onClose: () => void;
  onAceitar: (caso: CasoCliente) => void;
  onDeclinar: () => void;
}) {
  if (!caso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Novo Caso Pendente
          </DialogTitle>
          <DialogDescription>
            Um novo caso foi solicitado e está aguardando um advogado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Título do Caso</h4>
              <p className="text-sm text-muted-foreground">{caso.titulo}</p>
            </div>
            <div>
              <h4 className="font-medium">Cliente</h4>
              <p className="text-sm text-muted-foreground">{caso.clienteNome}</p>
            </div>
            <div>
              <h4 className="font-medium">Tipo de Processo</h4>
              <p className="text-sm text-muted-foreground">{caso.tipoProcesso}</p>
            </div>
            <div>
              <h4 className="font-medium">Urgência</h4>
              <p className="text-sm text-muted-foreground capitalize">{caso.urgencia}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">{caso.descricao}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Situação Atual</h4>
            <p className="text-sm text-muted-foreground">{caso.situacaoAtual}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Objetivos</h4>
            <p className="text-sm text-muted-foreground">{caso.objetivos}</p>
          </div>
          
          {caso.documentosDisponiveis && (
            <div>
              <h4 className="font-medium">Documentos Disponíveis</h4>
              <p className="text-sm text-muted-foreground">{caso.documentosDisponiveis}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDeclinar} className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declinar Caso
          </Button>
          <Button onClick={() => onAceitar(caso)} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Assumir Caso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Versão Web para Advogados
function CasosAdvogadoWeb() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const { casosAdvogado, loading, recarregar } = useCasosAdvogado();
  const { casosPendentes, recarregar: recarregarPendentes } = useCasosPendentes();
  const [casoModalAtual, setCasoModalAtual] = useState<CasoCliente | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFoiFechada, setModalFoiFechada] = useState(false);
  const { user } = useAuthStore();
  const { success, error } = useToast();

  // Verificar casos pendentes ao carregar (apenas na primeira vez)
  useEffect(() => {
    if (casosPendentes.length > 0 && !modalAberto && !modalFoiFechada) {
      setCasoModalAtual(casosPendentes[0]);
      setModalAberto(true);
    }
  }, [casosPendentes, modalAberto, modalFoiFechada]);

  const filteredCasos = casosAdvogado.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aceitarCaso = (caso: CasoCliente) => {
    if (!user) return;

    try {
      // Atualizar o caso no localStorage casoCliente
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "aceito",
            `Caso aceito pelo advogado ${user.nome || "Advogado"}`,
            "advogado",
            `Advogado responsável: ${user.nome || "Advogado"}`
          );
          
          return { 
            ...c, 
            status: "aceito", 
            advogadoId: user.id?.toString(),
            advogadoNome: user.nome || "Advogado",
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosAtualizados));

      // Criar novo caso no localStorage casosAdvogado
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const novoCasoAdvogado: CasoAdvogado = {
        id: `adv_${Date.now()}`,
        casoClienteId: caso.id,
        advogadoId: user.id?.toString() || "",
        advogadoNome: user.nome || "Advogado",
        clienteId: caso.clienteId,
        clienteNome: caso.clienteNome,
        titulo: caso.titulo,
        tipoProcesso: caso.tipoProcesso,
        descricao: caso.descricao,
        situacaoAtual: caso.situacaoAtual,
        objetivos: caso.objetivos,
        urgencia: caso.urgencia,
        documentosDisponiveis: caso.documentosDisponiveis,
        dataSolicitacao: caso.dataSolicitacao,
        dataAceite: new Date().toISOString(),
        status: "aceito"
      };

      casosAdvogado.push(novoCasoAdvogado);
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogado));

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Caso aceito com sucesso!");
      setModalAberto(false);
      setCasoModalAtual(null);
      recarregar();
      recarregarPendentes();
    } catch (err) {
      console.error("Erro ao aceitar caso:", err);
      error("Erro ao aceitar o caso. Tente novamente.");
    }
  };

  const declinarCaso = () => {
    setModalAberto(false);
    setCasoModalAtual(null);
    setModalFoiFechada(true); // Marcar que a modal foi fechada pelo usuário
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCasoModalAtual(null);
    setModalFoiFechada(true); // Marcar que a modal foi fechada pelo usuário
  };

  return (
    <div className="p-8 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Casos</h1>
        <div className="flex gap-3">
          {/* Toggle de visualização */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </div>
          <Link href="/casos/novo">
            <Button className="bg-tertiary hover:bg-chart-1 text-primary-foreground">
              Novo Processo
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtro de busca */}
      <div className="mb-6">
        <Input
          placeholder="Buscar por título do caso ou nome do cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredCasos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum caso encontrado.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Solicitação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCasos.map((caso) => (
              <TableRow key={caso.id}>
                <TableCell>{caso.titulo}</TableCell>
                <TableCell>{caso.clienteNome}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(caso.status)}>
                    {getStatusLabel(caso.status)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Button asChild variant="outline">
                    <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ModalCasoPendente
        caso={casoModalAtual}
        isOpen={modalAberto}
        onClose={fecharModal}
        onAceitar={aceitarCaso}
        onDeclinar={declinarCaso}
      />
    </div>
  );
}

// Versão Mobile para Advogados
function CasosAdvogadoMobile() {
  const [searchTerm, setSearchTerm] = useState("");
  const { casosAdvogado, loading, recarregar } = useCasosAdvogado();
  const { casosPendentes, recarregar: recarregarPendentes } = useCasosPendentes();
  const [casoModalAtual, setCasoModalAtual] = useState<CasoCliente | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalFoiFechada, setModalFoiFechada] = useState(false);
  const { user } = useAuthStore();
  const { success, error } = useToast();

  // Verificar casos pendentes ao carregar (apenas na primeira vez)
  useEffect(() => {
    if (casosPendentes.length > 0 && !modalAberto && !modalFoiFechada) {
      setCasoModalAtual(casosPendentes[0]);
      setModalAberto(true);
    }
  }, [casosPendentes, modalAberto, modalFoiFechada]);

  const filteredCasos = casosAdvogado.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aceitarCaso = (caso: CasoCliente) => {
    if (!user) return;

    try {
      // Atualizar o caso no localStorage casoCliente
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "aceito",
            `Caso aceito pelo advogado ${user.nome || "Advogado"}`,
            "advogado",
            `Advogado responsável: ${user.nome || "Advogado"}`
          );
          
          return { 
            ...c, 
            status: "aceito", 
            advogadoId: user.id?.toString(),
            advogadoNome: user.nome || "Advogado",
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosAtualizados));

      // Criar novo caso no localStorage casosAdvogado
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const novoCasoAdvogado: CasoAdvogado = {
        id: `adv_${Date.now()}`,
        casoClienteId: caso.id,
        advogadoId: user.id?.toString() || "",
        advogadoNome: user.nome || "Advogado",
        clienteId: caso.clienteId,
        clienteNome: caso.clienteNome,
        titulo: caso.titulo,
        tipoProcesso: caso.tipoProcesso,
        descricao: caso.descricao,
        situacaoAtual: caso.situacaoAtual,
        objetivos: caso.objetivos,
        urgencia: caso.urgencia,
        documentosDisponiveis: caso.documentosDisponiveis,
        dataSolicitacao: caso.dataSolicitacao,
        dataAceite: new Date().toISOString(),
        status: "aceito"
      };

      casosAdvogado.push(novoCasoAdvogado);
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogado));

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Caso aceito com sucesso!");
      setModalAberto(false);
      setCasoModalAtual(null);
      recarregar();
      recarregarPendentes();
    } catch (err) {
      console.error("Erro ao aceitar caso:", err);
      error("Erro ao aceitar o caso. Tente novamente.");
    }
  };

  const declinarCaso = () => {
    setModalAberto(false);
    setCasoModalAtual(null);
    setModalFoiFechada(true); // Marcar que a modal foi fechada pelo usuário
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCasoModalAtual(null);
    setModalFoiFechada(true); // Marcar que a modal foi fechada pelo usuário
  };

  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Meus Casos</h1>

      {/* Filtro de busca */}
      <div className="mb-4">
        <Input
          placeholder="Buscar por título ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Listagem de casos */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : filteredCasos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum caso encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCasos.map((caso) => (
            <div key={caso.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{caso.titulo}</h3>
              <div className="grid grid-cols-2 gap-2 my-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente:</span> {caso.clienteNome}
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span> {getStatusLabel(caso.status)}
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span> {new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}
                </div>
                <div>
                  <span className="text-muted-foreground">Urgência:</span> {caso.urgencia}
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      <ModalCasoPendente
        caso={casoModalAtual}
        isOpen={modalAberto}
        onClose={fecharModal}
        onAceitar={aceitarCaso}
        onDeclinar={declinarCaso}
      />
    </div>
  );
}

// Componente principal que escolhe entre web e mobile
export function CasosAdvogado() {
  const { isMobile } = useLayout();
  
  return isMobile ? <CasosAdvogadoMobile /> : <CasosAdvogadoWeb />;
}

// Componente para detalhes de um caso específico (pode ser reutilizado em ambas versões)
export function DetalheCasoAdvogado({ casoId }: { casoId: string }) {
  const { isMobile } = useLayout();
  const [caso, setCaso] = useState<CasoAdvogado | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const carregarCaso = () => {
      try {
        const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
        const casoEncontrado = casosAdvogado.find((c: CasoAdvogado) => c.id === casoId);
        setCaso(casoEncontrado || null);
      } catch (error) {
        console.error('Erro ao carregar caso:', error);
        setCaso(null);
      } finally {
        setLoading(false);
      }
    };

    if (casoId) {
      carregarCaso();
    }
  }, [casoId]);

  const solicitarDocumentos = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente no localStorage
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosClienteAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.casoClienteId) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "aguardando_documentos",
            `Advogado solicitou documentos adicionais`,
            "advogado",
            `Solicitação feita pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "aguardando_documentos", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosClienteAtualizados));

      // Atualizar o caso do advogado no localStorage
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const casosAdvogadoAtualizados = casosAdvogado.map((c: CasoAdvogado) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "esperando_documentos",
            `Advogado solicitou documentos adicionais`,
            "advogado",
            `Solicitação feita pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "esperando_documentos", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogadoAtualizados));

      // Atualizar o estado local
      setCaso({ ...caso, status: "esperando_documentos" });

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Solicitação de documentos enviada ao cliente!");
    } catch (err) {
      console.error("Erro ao solicitar documentos:", err);
      error("Erro ao solicitar documentos. Tente novamente.");
    }
  };

  const protocolarCaso = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente no localStorage
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosClienteAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.casoClienteId) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "protocolado",
            `Caso protocolado no fórum competente`,
            "advogado",
            `Protocolado pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "protocolado", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosClienteAtualizados));

      // Atualizar o caso do advogado no localStorage
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const casosAdvogadoAtualizados = casosAdvogado.map((c: CasoAdvogado) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "protocolado",
            `Caso protocolado no fórum competente`,
            "advogado",
            `Protocolado pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "protocolado", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogadoAtualizados));

      // Atualizar o estado local
      setCaso({ ...caso, status: "protocolado" });

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Caso protocolado com sucesso! Aguardando análise do fórum competente.");
    } catch (err) {
      console.error("Erro ao protocolar caso:", err);
      error("Erro ao protocolar o caso. Tente novamente.");
    }
  };

  const aprovarDocumentos = () => {
    if (!caso) return;

    try {
      // Atualizar o caso do cliente no localStorage
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosClienteAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.casoClienteId) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "em_andamento",
            `Documentos aprovados - caso em andamento`,
            "advogado",
            `Documentos aprovados pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "em_andamento", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosClienteAtualizados));

      // Atualizar o caso do advogado no localStorage
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const casosAdvogadoAtualizados = casosAdvogado.map((c: CasoAdvogado) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "em_andamento",
            `Documentos aprovados - caso em andamento`,
            "advogado",
            `Documentos aprovados pelo advogado ${caso.advogadoNome}`
          );
          
          return { 
            ...c, 
            status: "em_andamento", 
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogadoAtualizados));

      // Atualizar o estado local
      setCaso({ ...caso, status: "em_andamento" });

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Documentos aprovados! O caso agora está em andamento.");
      
      // Recarregar a página para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error("Erro ao aprovar documentos:", err);
      error("Erro ao aprovar documentos. Tente novamente.");
    }
  };

  const rejeitarDocumentos = () => {
    if (!caso) return;

    const motivo = prompt("Informe o motivo da rejeição dos documentos:");
    if (!motivo) return;

    try {
      // Atualizar o caso do cliente no localStorage
      const casosCliente = JSON.parse(localStorage.getItem("casoCliente") || "[]");
      const casosClienteAtualizados = casosCliente.map((c: CasoCliente) => {
        if (c.id === caso.casoClienteId) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "aguardando_documentos",
            `Documentos rejeitados - reenvio solicitado`,
            "advogado",
            `Motivo: ${motivo}`
          );
          
          return { 
            ...c, 
            status: "aguardando_documentos",
            motivoRejeicao: motivo,
            documentosAnexados: [], // Limpar documentos rejeitados
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casoCliente", JSON.stringify(casosClienteAtualizados));

      // Atualizar o caso do advogado no localStorage
      const casosAdvogado = JSON.parse(localStorage.getItem("casosAdvogado") || "[]");
      const casosAdvogadoAtualizados = casosAdvogado.map((c: CasoAdvogado) => {
        if (c.id === caso.id) {
          const timelineEntry = addTimelineEntry(
            c.status,
            "esperando_documentos",
            `Documentos rejeitados - reenvio solicitado`,
            "advogado",
            `Motivo: ${motivo}`
          );
          
          return { 
            ...c, 
            status: "esperando_documentos",
            motivoRejeicao: motivo,
            documentosAnexados: [], // Limpar documentos rejeitados
            timeline: [...(c.timeline || []), timelineEntry]
          };
        }
        return c;
      });
      localStorage.setItem("casosAdvogado", JSON.stringify(casosAdvogadoAtualizados));

      // Atualizar o estado local
      setCaso({ ...caso, status: "esperando_documentos", documentosAnexados: [] });

      // Disparar eventos de atualização
      window.dispatchEvent(new CustomEvent("casoClienteUpdated"));
      window.dispatchEvent(new CustomEvent("casosAdvogadoUpdated"));

      success("Documentos rejeitados. O cliente foi notificado para reenviar.");
      
      // Recarregar a página para refletir as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error("Erro ao rejeitar documentos:", err);
      error("Erro ao rejeitar documentos. Tente novamente.");
    }
  };

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
          <p className="text-muted-foreground">Cliente: {caso.clienteNome}</p>
          <p className="text-muted-foreground">Advogado: {caso.advogadoNome}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(caso.status)}>
          {getStatusLabel(caso.status)}
        </Badge>
      </div>

      {/* Botões de ação */}
      <div className={`mb-6 ${isMobile ? 'flex flex-col gap-2' : 'flex gap-4 flex-wrap'}`}>
        <Button
          onClick={solicitarDocumentos}
          disabled={caso.status === "esperando_documentos" || caso.status === "protocolado" || caso.status === "aguardando_analise_documentos"}
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Solicitar Documentos
        </Button>
        
        {caso.status === "aguardando_analise_documentos" && caso.documentosAnexados && caso.documentosAnexados.length > 0 && (
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
          disabled={caso.status === "protocolado" || caso.status === "aguardando_analise_documentos"}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Protocolar Caso
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Seção de Ações Necessárias */}
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <h2 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">🎯 Ações Necessárias</h2>
            <div className="space-y-2">
              {caso.status === "aceito" && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • <strong>Próximo passo:</strong> Solicite os documentos necessários do cliente ou inicie o desenvolvimento do caso.
                </p>
              )}
              {caso.status === "esperando_documentos" && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • <strong>Aguardando:</strong> Cliente deve enviar os documentos solicitados. Você será notificado quando os documentos forem enviados.
                </p>
              )}
              {caso.status === "aguardando_analise_documentos" && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • <strong>Ação requerida:</strong> Analise os {caso.documentosAnexados?.length || 0} documento(s) enviado(s) pelo cliente. Aprove ou rejeite os documentos.
                </p>
              )}
              {caso.status === "em_andamento" && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • <strong>Em andamento:</strong> Documentos aprovados. Continue com o desenvolvimento do caso e protocole quando estiver pronto.
                </p>
              )}
              {caso.status === "protocolado" && (
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  • <strong>Protocolado:</strong> Caso enviado ao fórum competente. Aguarde retorno da análise judicial.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Informações do Caso</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {getStatusLabel(caso.status)}</p>
                <p><span className="font-medium">Data de Solicitação:</span> {new Date(caso.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                <p><span className="font-medium">Data de Aceite:</span> {new Date(caso.dataAceite).toLocaleDateString('pt-BR')}</p>
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
              
              {caso.documentosDisponiveis && (
                <>
                  <h3 className="font-medium mb-2">Documentos Disponíveis</h3>
                  <p className="text-sm text-muted-foreground">{caso.documentosDisponiveis}</p>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Aviso quando documentos estão em análise */}
          {caso.status === "aguardando_analise_documentos" && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">📋</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">Documentos Aguardando Análise</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    O cliente enviou documentos que precisam da sua análise. Revise e aprove ou rejeite os documentos.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Documentos do Processo</h2>
            
            {/* Documentos solicitados */}
            {caso.documentosDisponiveis && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Documentos Solicitados:</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{caso.documentosDisponiveis}</p>
                </div>
              </div>
            )}

            {/* Documentos enviados pelo cliente */}
            {caso.documentosAnexados && caso.documentosAnexados.length > 0 ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Documentos Enviados pelo Cliente ({caso.documentosAnexados.length})</h3>
                  <Badge variant={caso.status === "aguardando_analise_documentos" ? "default" : "secondary"} className="text-xs">
                    {caso.status === "aguardando_analise_documentos" ? "Pendente Análise" : "Analisado"}
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
                        <Badge 
                          variant={caso.status === "aguardando_analise_documentos" ? "default" : "outline"}
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
                  caso.status === "aguardando_analise_documentos" 
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                    : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className={`h-4 w-4 ${
                      caso.status === "aguardando_analise_documentos" 
                        ? "text-amber-600" 
                        : "text-green-600"
                    }`} />
                    <span className={`font-medium ${
                      caso.status === "aguardando_analise_documentos" 
                        ? "text-amber-900 dark:text-amber-100" 
                        : "text-green-900 dark:text-green-100"
                    }`}>
                      Total: {caso.documentosAnexados.length} documento(s) recebido(s)
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${
                    caso.status === "aguardando_analise_documentos" 
                      ? "text-amber-700 dark:text-amber-200" 
                      : "text-green-700 dark:text-green-200"
                  }`}>
                    {caso.status === "aguardando_analise_documentos" 
                      ? "⏳ Aguardando sua análise. Aprove ou rejeite os documentos usando os botões acima." 
                      : "✅ Documentos analisados e processados"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {caso.status === "esperando_documentos" 
                    ? "Aguardando envio de documentos pelo cliente."
                    : "Nenhum documento foi enviado pelo cliente ainda."
                  }
                </p>
              </div>
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
                          Status: {entry.statusAnterior ? `${getStatusLabel(entry.statusAnterior as CasoAdvogado["status"])} → ` : ""}{getStatusLabel(entry.novoStatus as CasoAdvogado["status"])}
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
                      <div className="w-0.5 h-16 bg-muted mt-2"></div>
                    </div>
                    <div className="pb-8">
                      <p className="text-sm text-muted-foreground">
                        {new Date(caso.dataAceite).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="font-medium">Caso aceito pelo advogado</p>
                      <p className="text-sm text-muted-foreground">O advogado {caso.advogadoNome} aceitou o caso</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
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
                      <p className="text-sm text-muted-foreground">Solicitação de caso enviada pelo cliente</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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