/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Calendar, User } from "lucide-react";
import { listarProcessos, buscarProcessoPorId } from "@/services/processo/processoService";
import { ProcessoDTO } from "@/types/entities/Processo";
import { StatusProcesso } from "@/types/enums";

// Função para obter label legível do status
const getStatusLabel = (status: StatusProcesso): string => {
  switch (status) {
    case StatusProcesso.RASCUNHO: return "Rascunho";
    case StatusProcesso.EM_ANDAMENTO: return "Em Andamento";
    case StatusProcesso.AGUARDANDO_DOCUMENTOS: return "Aguardando Documentos";
    case StatusProcesso.EM_JULGAMENTO: return "Em Julgamento";
    case StatusProcesso.CONCLUIDO: return "Concluído";
    case StatusProcesso.ARQUIVADO: return "Arquivado";
    default: return status;
  }
};

// Função para obter variant do Badge baseado no status
const getStatusBadgeVariant = (status: StatusProcesso) => {
  switch (status) {
    case StatusProcesso.RASCUNHO: return "outline";
    case StatusProcesso.EM_ANDAMENTO: return "default";
    case StatusProcesso.AGUARDANDO_DOCUMENTOS: return "secondary";
    case StatusProcesso.EM_JULGAMENTO: return "destructive";
    case StatusProcesso.CONCLUIDO: return "secondary";
    case StatusProcesso.ARQUIVADO: return "outline";
    default: return "outline";
  }
};

// Versão Web para Advogados
function CasosAdvogadoWeb() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [processos, setProcessos] = useState<ProcessoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const data = await listarProcessos();
        setProcessos(data);
      } catch (error) {
        console.error('Erro ao carregar processos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  const filteredCasos = processos.filter(
    (processo) =>
      processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar casos por status para o Kanban
  const casosPorStatus = {
    [StatusProcesso.RASCUNHO]: filteredCasos.filter(processo => processo.status === StatusProcesso.RASCUNHO),
    [StatusProcesso.EM_ANDAMENTO]: filteredCasos.filter(processo => processo.status === StatusProcesso.EM_ANDAMENTO),
    [StatusProcesso.AGUARDANDO_DOCUMENTOS]: filteredCasos.filter(processo => processo.status === StatusProcesso.AGUARDANDO_DOCUMENTOS),
    [StatusProcesso.EM_JULGAMENTO]: filteredCasos.filter(processo => processo.status === StatusProcesso.EM_JULGAMENTO),
    [StatusProcesso.CONCLUIDO]: filteredCasos.filter(processo => processo.status === StatusProcesso.CONCLUIDO),
    [StatusProcesso.ARQUIVADO]: filteredCasos.filter(processo => processo.status === StatusProcesso.ARQUIVADO),
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

      {viewMode === "list" ? (
        /* Visualização em Lista */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Abertura</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCasos.map((caso) => (
              <TableRow key={caso.id}>
                <TableCell>{caso.titulo}</TableCell>
                <TableCell>{caso.cliente.nome}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(caso.status)}>
                    {getStatusLabel(caso.status)}
                  </Badge>
                </TableCell>
                <TableCell>{caso.dataAbertura}</TableCell>
                <TableCell>
                  <Button asChild variant="outline">
                    <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        /* Visualização Kanban */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(casosPorStatus).map(([statusKey, casos]) => (
            <div key={statusKey} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{getStatusLabel(statusKey as StatusProcesso)}</h3>
                <Badge variant="outline" className="text-xs">
                  {casos.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {casos.map((caso) => (
                  <div key={caso.id} className="bg-background border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm line-clamp-2">{caso.titulo}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{caso.cliente.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{caso.dataAbertura}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{caso.descricao}</p>
                      <div className="pt-2">
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {casos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Nenhum caso {status.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Versão Mobile para Advogados
function CasosAdvogadoMobile() {
  const [searchTerm, setSearchTerm] = useState("");
  const [processos, setProcessos] = useState<ProcessoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const data = await listarProcessos();
        setProcessos(data);
      } catch (error) {
        console.error('Erro ao carregar processos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  const filteredCasos = processos.filter(
    (processo) =>
      processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="space-y-4">
        {filteredCasos.map((processo) => (
          <div key={processo.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">{processo.titulo}</h3>
            <div className="grid grid-cols-2 gap-2 my-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span> {processo.cliente.nome}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span> {getStatusLabel(processo.status)}
              </div>
              <div>
                <span className="text-muted-foreground">Data:</span> {processo.dataAbertura}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-2">
              <Link href={`/casos/${processo.id}`}>Ver Detalhes</Link>
            </Button>
          </div>
        ))}
      </div>
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
  const [processo, setProcesso] = useState<ProcessoDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcesso = async () => {
      try {
        const data = await buscarProcessoPorId(casoId);
        setProcesso(data);
      } catch (error) {
        console.error('Erro ao carregar processo:', error);
      } finally {
        setLoading(false);
      }
    };

    if (casoId) {
      fetchProcesso();
    }
  }, [casoId]);

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
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{processo.titulo}</h1>
          <p className="text-muted-foreground">Cliente: {processo.cliente.nome}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(processo.status)}>
          {getStatusLabel(processo.status)}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Andamentos</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Informações do Caso</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> {getStatusLabel(processo.status)}</p>
                <p><span className="font-medium">Data de Abertura:</span> {processo.dataAbertura}</p>
                <p><span className="font-medium">Descrição:</span> {processo.descricao}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Próximas Etapas</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Análise Inicial</p>
                    <p className="text-sm text-muted-foreground">Revisar documentos e entender o caso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-muted-foreground">Petição Inicial</p>
                    <p className="text-sm text-muted-foreground">Elaborar e protocolar petição inicial</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-muted-foreground">Audiência</p>
                    <p className="text-sm text-muted-foreground">Participar da audiência inicial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Documentos do Processo</h2>
            <p className="text-muted-foreground">Documentos ainda não implementados.</p>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Andamentos do Processo</h2>
            <div className="space-y-4">
              {processo.linhaDoTempo.map((update, index) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < processo.linhaDoTempo.length - 1 && (
                      <div className="w-0.5 h-16 bg-muted mt-2"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm text-muted-foreground">{update.dataAtualizacao}</p>
                    <p className="font-medium">{update.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{processo.cliente.email}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}