"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function ListaCasosAdvogadoWeb () {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCasos = casos.filter(
        (caso) =>
            caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            caso.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-6">Meus Casos</h1>

            {/* Filtro de busca */}
            <div className="mb-6">
                <Input
                    placeholder="Buscar por título do caso ou nome do cliente..."
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
                            <TableCell>{caso.status}</TableCell>
                            <TableCell>{caso.dataAbertura}</TableCell>
                            <TableCell>
                                <Button asChild variant="outline">
                                    <a href={`/casos/${caso.id}`}>Ver Detalhes</a>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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