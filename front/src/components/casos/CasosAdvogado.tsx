"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { CadastroProcessoAdvogado } from "./CadastroProcessoAdvogado";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Calendar, User } from "lucide-react";

// Dados mockados - em um ambiente real isso viria de uma API
const casosAdvogado = [
  {
    id: 1,
    titulo: "Caso XYZ - Direito do Consumidor",
    status: "Em andamento",
    dataAbertura: "01/10/2023",
    descricao: "Processo relacionado a uma compra com defeito.",
    cliente: {
      nome: "João Silva",
      email: "joao.silva@example.com",
      telefone: "(11) 98765-4321",
    },
    documentos: [
      { id: 1, nome: "Contrato", arquivo: "/documentos/contrato.pdf" },
      { id: 2, nome: "Nota Fiscal", arquivo: "/documentos/nota_fiscal.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "05/10/2023", descricao: "Processo aberto" },
      { id: 2, data: "10/10/2023", descricao: "Documentos enviados pelo cliente" },
    ],
  },
  {
    id: 2,
    titulo: "Caso ABC - Divórcio Consensual",
    status: "Finalizado",
    dataAbertura: "15/09/2023",
    descricao: "Processo de divórcio consensual entre as partes.",
    cliente: {
      nome: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      telefone: "(11) 91234-5678",
    },
    documentos: [
      { id: 1, nome: "Petição Inicial", arquivo: "/documentos/peticao_inicial.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "20/09/2023", descricao: "Processo aberto" },
      { id: 2, data: "25/09/2023", descricao: "Acordo assinado" },
    ],
  },
  {
    id: 3,
    titulo: "Caso DEF - Ação Trabalhista",
    status: "Aguardando",
    dataAbertura: "20/11/2023",
    descricao: "Processo sobre demissão sem justa causa e verbas rescisórias.",
    cliente: {
      nome: "Carlos Santos",
      email: "carlos.santos@example.com",
      telefone: "(11) 99876-5432",
    },
    documentos: [
      { id: 1, nome: "Carteira de Trabalho", arquivo: "/documentos/ctps.pdf" },
      { id: 2, nome: "Recibo de Pagamento", arquivo: "/documentos/recibo.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "25/11/2023", descricao: "Processo protocolado" },
      { id: 2, data: "30/11/2023", descricao: "Aguardando despacho do juiz" },
    ],
  },
  {
    id: 4,
    titulo: "Caso GHI - Inventário",
    status: "Cancelado",
    dataAbertura: "05/08/2023",
    descricao: "Processo de inventário de bens após falecimento.",
    cliente: {
      nome: "Ana Costa",
      email: "ana.costa@example.com",
      telefone: "(11) 98765-1234",
    },
    documentos: [
      { id: 1, nome: "Certidão de Óbito", arquivo: "/documentos/certidao_obito.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "10/08/2023", descricao: "Processo aberto" },
      { id: 2, data: "15/08/2023", descricao: "Processo cancelado por desistência" },
    ],
  },
  {
    id: 5,
    titulo: "Caso JKL - Guarda de Menor",
    status: "Em andamento",
    dataAbertura: "12/12/2023",
    descricao: "Ação de guarda e regulamentação de visitas.",
    cliente: {
      nome: "Roberto Lima",
      email: "roberto.lima@example.com",
      telefone: "(11) 91234-6789",
    },
    documentos: [
      { id: 1, nome: "Certidão de Nascimento", arquivo: "/documentos/certidao_nascimento.pdf" },
      { id: 2, nome: "Laudo Social", arquivo: "/documentos/laudo_social.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "15/12/2023", descricao: "Processo distribuído" },
      { id: 2, data: "20/12/2023", descricao: "Audiência de conciliação agendada" },
    ],
  },
];

// Versão Web para Advogados
function CasosAdvogadoWeb() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const filteredCasos = casosAdvogado.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar casos por status para o Kanban
  const casosPorStatus = {
    "Em andamento": filteredCasos.filter(caso => caso.status === "Em andamento"),
    "Finalizado": filteredCasos.filter(caso => caso.status === "Finalizado"),
    "Aguardando": filteredCasos.filter(caso => caso.status === "Aguardando"),
    "Cancelado": filteredCasos.filter(caso => caso.status === "Cancelado"),
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
                  <Badge variant={caso.status === "Em andamento" ? "default" : caso.status === "Finalizado" ? "secondary" : "outline"}>
                    {caso.status}
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
          {Object.entries(casosPorStatus).map(([status, casos]) => (
            <div key={status} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{status}</h3>
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

  const filteredCasos = casosAdvogado.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredCasos.map((caso) => (
          <div key={caso.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">{caso.titulo}</h3>
            <div className="grid grid-cols-2 gap-2 my-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente:</span> {caso.cliente.nome}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span> {caso.status}
              </div>
              <div>
                <span className="text-muted-foreground">Data:</span> {caso.dataAbertura}
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-2">
              <Link href={`/casos/${caso.id}`}>Ver Detalhes</Link>
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
  
  let casoIdNumerico: number;
  try {
    casoIdNumerico = parseInt(casoId);
    if (isNaN(casoIdNumerico)) {
      throw new Error("ID inválido");
    }
  } catch {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Caso não encontrado</h1>
        <p className="text-muted-foreground mb-4">O identificador do caso é inválido.</p>
        <Link href="/casos" className="text-primary underline">Voltar para lista de casos</Link>
      </div>
    );
  }
  
  const caso = casosAdvogado.find((c) => c.id === casoIdNumerico);

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
          <p className="text-muted-foreground">Cliente: {caso.cliente.nome}</p>
        </div>
        <Badge variant={caso.status === "Em andamento" ? "default" : "secondary"}>
          {caso.status}
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
                <p><span className="font-medium">Status:</span> {caso.status}</p>
                <p><span className="font-medium">Data de Abertura:</span> {caso.dataAbertura}</p>
                <p><span className="font-medium">Descrição:</span> {caso.descricao}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {caso.documentos.map((doc) => (
                <div key={doc.id} className="border rounded p-3 flex items-center justify-between">
                  <span>{doc.nome}</span>
                  <Button size="sm" variant="outline">Visualizar</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Andamentos do Processo</h2>
            <div className="space-y-4">
              {caso.movimentacoes.map((mov, index) => (
                <div key={mov.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < caso.movimentacoes.length - 1 && (
                      <div className="w-0.5 h-16 bg-muted mt-2"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm text-muted-foreground">{mov.data}</p>
                    <p className="font-medium">{mov.descricao}</p>
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
                <p className="text-muted-foreground">{caso.cliente.nome}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{caso.cliente.email}</p>
              </div>
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-muted-foreground">{caso.cliente.telefone}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}