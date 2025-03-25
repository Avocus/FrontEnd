/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DetalheCasosAdvogadoWebProps {
    casoId: string;
}

export function DetalheCasosAdvogadoWeb({ casoId }: DetalheCasosAdvogadoWebProps) {
    const caso = casosAdvogado.find((c) => c.id === parseInt(casoId));

    if (!caso) {
        return <div>Caso não encontrado</div>;
    }

    return (
        <div className="p-8 bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-6">{caso.titulo}</h1>

            {/* Informações do caso */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Informações do Caso</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Status:</strong> {caso.status}</p>
                    <p><strong>Data de Abertura:</strong> {caso.dataAbertura}</p>
                    <p><strong>Descrição:</strong> {caso.descricao}</p>
                </CardContent>
            </Card>

            {/* Informações do cliente */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Nome:</strong> {caso.cliente.nome}</p>
                    <p><strong>E-mail:</strong> {caso.cliente.email}</p>
                    <p><strong>Telefone:</strong> {caso.cliente.telefone}</p>
                </CardContent>
            </Card>

            {/* Documentos */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {caso.documentos.map((documento) => (
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

            {/* Movimentações */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Movimentações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {caso.movimentacoes.map((movimentacao) => (
                            <div key={movimentacao.id}>
                                <p><strong>{movimentacao.data}:</strong> {movimentacao.descricao}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

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
            telefone: "(11) 99999-9999",
        },
        documentos: [
            { id: "1", nome: "Contrato", arquivo: "/documentos/contrato.pdf" },
            { id: "2", nome: "Nota Fiscal", arquivo: "/documentos/nota_fiscal.pdf" },
        ],
        movimentacoes: [
            { id: "1", data: "05/10/2023", descricao: "Processo aberto" },
            { id: "2", data: "10/10/2023", descricao: "Documentos enviados" },
        ],
    },
    {
        id: 2,
        titulo: "Caso ABC - Divórcio Consensual",
        status: "Finalizado",
        dataAbertura: "15/09/2023",
        descricao: "Processo de divórcio consensual entre as partes.",
        cliente: {
            nome: "Maria Souza",
            email: "maria.souza@example.com",
            telefone: "(21) 88888-8888",
        },
        documentos: [
            { id: "1", nome: "Petição Inicial", arquivo: "/documentos/peticao_inicial.pdf" },
        ],
        movimentacoes: [
            { id: "1", data: "20/09/2023", descricao: "Processo aberto" },
            { id: "2", data: "25/09/2023", descricao: "Acordo assinado" },
        ],
    },
];