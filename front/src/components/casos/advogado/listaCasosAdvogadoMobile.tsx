"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ListaCasosAdvogadoMobile () {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCasos = casos.filter(
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
                    <Card key={caso.id}>
                        <CardHeader>
                            <CardTitle>{caso.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Cliente:</strong> {caso.cliente.nome}</p>
                            <p><strong>Status:</strong> {caso.status}</p>
                            <p><strong>Data de Abertura:</strong> {caso.dataAbertura}</p>
                            <Button asChild variant="outline" className="mt-2">
                                <a href={`/casos/${caso.id}`}>Ver Detalhes</a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const casos = [
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
];