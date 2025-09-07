"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados mockados - em um ambiente real isso viria de uma API
const casosCliente = [
  {
    id: 1,
    titulo: "Caso XYZ - Direito do Consumidor",
    status: "Em andamento",
    dataAbertura: "01/10/2023",
    descricao: "Processo relacionado a uma compra com defeito.",
    advogado: {
      nome: "Dr. Carlos Mendes",
      email: "carlos.mendes@example.com",
      telefone: "(11) 98765-4321",
    },
    documentos: [
      { id: 1, nome: "Contrato", arquivo: "/documentos/contrato.pdf" },
      { id: 2, nome: "Nota Fiscal", arquivo: "/documentos/nota_fiscal.pdf" },
    ],
    movimentacoes: [
      { id: 1, data: "05/10/2023", descricao: "Processo aberto" },
      { id: 2, data: "10/10/2023", descricao: "Documentos enviados" },
    ],
  },
  {
    id: 2,
    titulo: "Caso ABC - Divórcio Consensual",
    status: "Finalizado",
    dataAbertura: "15/09/2023",
    descricao: "Processo de divórcio consensual entre as partes.",
    advogado: {
      nome: "Dra. Ana Soares",
      email: "ana.soares@example.com",
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
];

// Versão Web para Clientes
function CasosClienteWeb() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCasos = casosCliente.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Meus Casos</h1>

      {/* Filtro de busca */}
      <div className="mb-6">
        <Input
          placeholder="Buscar por título do caso ou status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {/* Listagem de casos */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Advogado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Abertura</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCasos.map((caso) => (
            <TableRow key={caso.id}>
              <TableCell>{caso.titulo}</TableCell>
              <TableCell>{caso.advogado.nome}</TableCell>
              <TableCell>{caso.status}</TableCell>
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
    </div>
  );
}

// Versão Mobile para Clientes
function CasosClienteMobile() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCasos = casosCliente.filter(
    (caso) =>
      caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Meus Casos</h1>

      {/* Filtro de busca */}
      <div className="mb-4">
        <Input
          placeholder="Buscar por título ou status..."
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
                <span className="text-muted-foreground">Advogado:</span> {caso.advogado.nome}
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
export function CasosCliente() {
  const { isMobile } = useLayout();
  
  return isMobile ? <CasosClienteMobile /> : <CasosClienteWeb />;
}

// Componente para detalhes de um caso específico (pode ser reutilizado em ambas versões)
export function DetalheCasoCliente({ casoId }: { casoId: string }) {
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
  
  const caso = casosCliente.find((c) => c.id === casoIdNumerico);

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
          <p className="text-muted-foreground">Advogado: {caso.advogado.nome}</p>
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
          <TabsTrigger value="lawyer">Advogado</TabsTrigger>
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

        <TabsContent value="lawyer" className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Informações do Advogado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nome</p>
                <p className="text-muted-foreground">{caso.advogado.nome}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{caso.advogado.email}</p>
              </div>
              <div>
                <p className="font-medium">Telefone</p>
                <p className="text-muted-foreground">{caso.advogado.telefone}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}