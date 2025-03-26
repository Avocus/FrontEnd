"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Content {
    id: number;
    titulo: string;
    categoria: string;
    imagem: string;
    subTitulo: string;
    conteudo: string;
}


export function BibliotecaMobile () {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);

    const filteredContents = conteudos.filter(
        (content) =>
            content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 bg-background text-foreground">
            {/* <h1 className="text-2xl font-bold mb-4">Biblioteca Jurídica</h1> */}

            {/* Barra de Busca */}
            <div className="mb-4">
                <Input
                    placeholder="Buscar por título ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Lista de Conteúdos */}
            <div className="space-y-4">
                {filteredContents.map((content) => (
                    <Card
                        key={content.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedContent(content)}
                    >
                        <CardHeader>
                            <CardTitle>{content.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-secondary-foreground">{content.categoria}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detalhes do Conteúdo */}
            {selectedContent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{selectedContent.titulo}</CardTitle>
                            <p className="text-sm text-secondary-foreground">{selectedContent.subTitulo}</p>
                        </CardHeader>
                        <CardContent>
                            <Image src={selectedContent.imagem} alt={selectedContent.titulo} className="w-full h-32 object-cover mb-4" />
                            <p>{selectedContent.conteudo}</p>
                            <Button onClick={() => setSelectedContent(null)} className="mt-4">
                                Fechar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const conteudos = [
    {
        "id": 1,
        "titulo": "Como funciona a multa por excesso de velocidade?",
        "categoria": "Trânsito",
        "imagem": "/transito1.jpg",
        "subTitulo": "Entenda as regras e como recorrer",
        "conteudo": "A multa por excesso de velocidade é aplicada quando o condutor ultrapassa os limites estabelecidos... (texto completo)"
    },
    {
        "id": 2,
        "titulo": "Direitos do trabalhador em caso de demissão",
        "categoria": "Trabalho",
        "imagem": "/trabalho1.jpg",
        "subTitulo": "Saiba o que fazer se for demitido",
        "conteudo": "Em caso de demissão, o trabalhador tem direito a uma série de benefícios, como seguro-desemprego... (texto completo)"
    },
    {
        "id": 3,
        "titulo": "Guarda compartilhada: o que é e como funciona?",
        "categoria": "Família",
        "imagem": "/familia1.jpg",
        "subTitulo": "Entenda os direitos dos pais e filhos",
        "conteudo": "A guarda compartilhada é um modelo em que ambos os pais dividem as responsabilidades sobre os filhos... (texto completo)"
    },
    {
        "id": 4,
        "titulo": "Como recorrer de uma multa de trânsito?",
        "categoria": "Trânsito",
        "imagem": "/transito2.jpg",
        "subTitulo": "Passo a passo para contestar",
        "conteudo": "Para recorrer de uma multa de trânsito, é necessário seguir alguns passos, como apresentar defesa... (texto completo)"
    },
    {
        "id": 5,
        "titulo": "Pensão alimentícia: como calcular?",
        "categoria": "Família",
        "imagem": "/familia2.jpg",
        "subTitulo": "Entenda os critérios e valores",
        "conteudo": "A pensão alimentícia é calculada com base nas necessidades do filho e na capacidade financeira dos pais... (texto completo)"
    }
];