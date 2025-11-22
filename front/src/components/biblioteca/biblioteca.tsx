"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Search, Calendar, Clock } from "lucide-react";
import { conteudos, categorias } from "@/data/bibliotecaData";
import { BibliotecaContent } from "@/types/common";
import "../../styles/biblioteca.css";

export function Biblioteca() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContent, setSelectedContent] = useState<BibliotecaContent | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredContents = conteudos.filter((content) => {
        const matchesSearch = 
            content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.palavrasChave.some(palavra => 
                palavra.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            content.resumo.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "Todos" || content.categoria === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-8 bg-background text-foreground min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-center">Biblioteca Jurídica</h1>
                <p className="text-muted-foreground text-center mb-8">
                    Conteúdo jurídico atualizado e especializado para sua consulta
                </p>

                {/* Barra de Busca e Filtros */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por título, categoria ou palavra-chave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filtro por Categorias */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categorias.map((categoria) => (
                            <Button
                                key={categoria}
                                variant={selectedCategory === categoria ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(categoria)}
                                className="h-8"
                            >
                                {categoria}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Resultados */}
                <div className="mb-4 text-center text-muted-foreground">
                    {filteredContents.length} artigo(s) encontrado(s)
                </div>

                {/* Lista de Conteúdos */}
                <div className="biblioteca-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredContents.map((content) => (
                        <Card
                            key={content.id}
                            className="biblioteca-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden"
                            onClick={() => setSelectedContent(content)}
                        >
                            <div className="relative h-48 w-full">
                                <Image 
                                    src={content.imagem} 
                                    alt={content.titulo} 
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="categoria-badge">{content.categoria}</Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg line-clamp-2">{content.titulo}</CardTitle>
                                <p className="text-sm text-muted-foreground">{content.subTitulo}</p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                    {content.resumo}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {content.dataPublicacao}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {content.tempoLeitura}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {content.palavrasChave.slice(0, 3).map((palavra, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {palavra}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Modal de Detalhes do Conteúdo */}
                {selectedContent && (
                    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="relative h-64 w-full">
                                <Image 
                                    src={selectedContent.imagem} 
                                    alt={selectedContent.titulo} 
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    onClick={() => setSelectedContent(null)}
                                    className="absolute top-4 right-4 rounded-full"
                                    size="sm"
                                    variant="secondary"
                                >
                                    ✕
                                </Button>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge>{selectedContent.categoria}</Badge>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {selectedContent.dataPublicacao}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {selectedContent.tempoLeitura}
                                        </div>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">{selectedContent.titulo}</CardTitle>
                                <p className="text-lg text-muted-foreground">{selectedContent.subTitulo}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-content max-w-none">
                                    {selectedContent.conteudo.split('\n\n').map((paragrafo: string, index: number) => (
                                        <p key={index} className="mb-4 text-justify leading-relaxed">
                                            {paragrafo}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-semibold mb-2">Palavras-chave:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedContent.palavrasChave.map((palavra: string, index: number) => (
                                            <Badge key={index} variant="outline">
                                                {palavra}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};