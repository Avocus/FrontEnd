"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, X } from "lucide-react";
import Image from "next/image";
import { conteudos, categorias, type Content } from "@/data/bibliotecaData";
import "../../styles/biblioteca.css";

export function BibliotecaMobile() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredContents = conteudos.filter((content) => {
        const matchesSearch = 
            content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.palavrasChave.some((palavra: string) => 
                palavra.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            content.resumo.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "Todos" || content.categoria === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-4 bg-background text-foreground min-h-screen">
            <div className="max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-1 text-center">Biblioteca Jurídica</h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Conteúdo jurídico especializado
                </p>

                {/* Barra de Busca */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar artigos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filtro por Categorias - Horizontal Scroll */}
                <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categorias.map((categoria) => (
                            <Button
                                key={categoria}
                                variant={selectedCategory === categoria ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(categoria)}
                                className="whitespace-nowrap h-8 text-xs flex-shrink-0"
                            >
                                {categoria}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Resultados */}
                <div className="mb-4 text-center text-sm text-muted-foreground">
                    {filteredContents.length} artigo(s) encontrado(s)
                </div>

                {/* Lista de Conteúdos */}
                <div className="space-y-4">
                    {filteredContents.map((content) => (
                        <Card
                            key={content.id}
                            className="biblioteca-card cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
                            onClick={() => setSelectedContent(content)}
                        >
                            <div className="relative h-32 w-full">
                                <Image 
                                    src={content.imagem} 
                                    alt={content.titulo} 
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="categoria-badge text-xs">
                                        {content.categoria}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base line-clamp-2">{content.titulo}</CardTitle>
                                <p className="text-xs text-muted-foreground">{content.subTitulo}</p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {content.resumo}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {content.dataPublicacao}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {content.tempoLeitura}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {content.palavrasChave.slice(0, 2).map((palavra: string, index: number) => (
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
                    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
                        <Card className="modal-content w-full max-w-lg mt-4 mb-4">
                            <div className="relative h-48 w-full">
                                <Image 
                                    src={selectedContent.imagem} 
                                    alt={selectedContent.titulo} 
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    onClick={() => setSelectedContent(null)}
                                    className="absolute top-4 right-4 rounded-full w-8 h-8 p-0"
                                    variant="secondary"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="text-xs">{selectedContent.categoria}</Badge>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {selectedContent.dataPublicacao}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {selectedContent.tempoLeitura}
                                        </div>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{selectedContent.titulo}</CardTitle>
                                <p className="text-sm text-muted-foreground">{selectedContent.subTitulo}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm prose-content max-w-none">
                                    {selectedContent.conteudo.split('\n\n').map((paragrafo, index) => (
                                        <p key={index} className="mb-3 text-sm leading-relaxed text-justify">
                                            {paragrafo}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t">
                                    <h4 className="font-semibold mb-2 text-sm">Palavras-chave:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedContent.palavrasChave.map((palavra: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {palavra}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => setSelectedContent(null)} 
                                    className="w-full mt-4"
                                    size="sm"
                                >
                                    Fechar
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};