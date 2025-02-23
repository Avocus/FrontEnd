import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Table } from "lucide-react";

export function DadosClienteWeb() {
    return (
        <div className="p-8 bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-6">Perfil do Cliente</h1>

            {/* Abas principais */}
            <Tabs defaultValue="informacoes" className="w-full">
                <TabsList className="flex gap-4 mb-6">
                    <TabsTrigger value="informacoes">Informações Pessoais</TabsTrigger>
                    <TabsTrigger value="processos">Processos</TabsTrigger>
                    <TabsTrigger value="documentos">Documentos</TabsTrigger>
                    <TabsTrigger value="pendencias">Pendências</TabsTrigger>
                </TabsList>

                {/* Conteúdo das abas */}
                <TabsContent value="informacoes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>Nome:</strong> {cliente.nome}</p>
                            <p><strong>E-mail:</strong> {cliente.email}</p>
                            <p><strong>Telefone:</strong> {cliente.telefone}</p>
                            <p><strong>CPF:</strong> {cliente.cpf}</p>
                            <p><strong>Endereço:</strong> {cliente.endereco}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="processos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Processos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Processos Ativos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{cliente.processosAtivos}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Processos Finalizados</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">{cliente.processosFinalizados}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cliente.processos.map((processo) => (
                                        <TableRow key={processo.id}>
                                            <TableCell>{processo.titulo}</TableCell>
                                            <TableCell>{processo.status}</TableCell>
                                            <TableCell>{processo.data}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documentos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentos Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cliente.documentos.map((documento) => (
                                    <div key={documento.id} className="flex justify-between items-center">
                                        <p>{documento.nome}</p>
                                        <Button asChild variant="outline">
                                            <a href={documento.arquivo} target="_blank" rel="noopener noreferrer">
                                                Visualizar
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pendencias">
                    <Card>
                        <CardHeader>
                            <CardTitle>Central de Pendências</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cliente.pendências.map((pendencia) => (
                                    <Card key={pendencia.id}>
                                        <CardHeader>
                                            <CardTitle>{pendencia.descricao}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p><strong>Prazo:</strong> {pendencia.prazo}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const cliente = {
    nome: "João Silva",
    email: "joao.silva@example.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    endereco: "Rua Exemplo, 123 - São Paulo, SP",
    processosAtivos: 3,
    processosFinalizados: 5,
    pendências: [
        { id: 1, descricao: "Enviar documento X para o caso Y", prazo: "10/11/2023" },
        { id: 2, descricao: "Assinar contrato do caso Z", prazo: "15/11/2023" },
    ],
    processos: [
        { id: 1, titulo: "Caso XYZ", status: "Ativo", data: "01/10/2023" },
        { id: 2, titulo: "Caso ABC", status: "Finalizado", data: "15/09/2023" },
        { id: 3, titulo: "Caso DEF", status: "Ativo", data: "20/08/2023" },
    ],
    documentos: [
        { id: 1, nome: "RG", arquivo: "/documentos/rg.pdf" },
        { id: 2, nome: "CPF", arquivo: "/documentos/cpf.pdf" },
    ],
};