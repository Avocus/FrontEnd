"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Content {
    id: number;
    titulo: string;
    url: string;
    thumbnail: string;
}

export function VideotecaMobile () {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);

    const filteredVideos = videos.filter((video) =>
        video.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 bg-background text-foreground">

            {/* Barra de Busca */}
            <div className="mb-4">
                <Input
                    placeholder="Buscar vídeos por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Lista de Vídeos */}
            <div className="space-y-4">
                {filteredVideos.map((video) => (
                    <Card
                        key={video.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedVideo(video)}
                    >
                        <CardHeader>
                            <CardTitle>{video.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={video.thumbnail}
                                alt={video.titulo}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reprodutor de Vídeo */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{selectedVideo.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <iframe
                                src={selectedVideo.url}
                                title={selectedVideo.titulo}
                                className="w-full h-48"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            <Button onClick={() => setSelectedVideo(null)} className="mt-4">
                                Fechar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const videos = [
    {
        "id": 1,
        "titulo": "Recebi uma intimação e agora? - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/lEDnYNFR7vg",
        "thumbnail": "https://img.youtube.com/vi/lEDnYNFR7vg/hqdefault.jpg"
    },
    {
        "id": 2,
        "titulo": "Como funciona a guarda compartilhada? - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/GEpfowWNXw0",
        "thumbnail": "https://img.youtube.com/vi/GEpfowWNXw0/hqdefault.jpg"
    },
    {
        "id": 3,
        "titulo": "Pensão alimentícia: o que você precisa saber - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/u_ARF47yR50",
        "thumbnail": "https://img.youtube.com/vi/u_ARF47yR50/hqdefault.jpg"
    },
    {
        "id": 4,
        "titulo": "Direitos do consumidor: conheça seus direitos - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/DtfYbqSsMd4",
        "thumbnail": "https://img.youtube.com/vi/DtfYbqSsMd4/hqdefault.jpg"
    },
    {
        "id": 5,
        "titulo": "Como proceder em casos de difamação - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/Teik7kRozOs",
        "thumbnail": "https://img.youtube.com/vi/Teik7kRozOs/hqdefault.jpg"
    },
    {
        "id": 6,
        "titulo": "Entendendo o direito de herança - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/wwuZpHGQ09Y",
        "thumbnail": "https://img.youtube.com/vi/wwuZpHGQ09Y/hqdefault.jpg"
    },
    {
        "id": 7,
        "titulo": "Como registrar uma marca - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/zikFXR6ZyfU",
        "thumbnail": "https://img.youtube.com/vi/zikFXR6ZyfU/hqdefault.jpg"
    },
    {
        "id": 8,
        "titulo": "Direito trabalhista: conheça seus direitos - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/m0okKy45emU",
        "thumbnail": "https://img.youtube.com/vi/m0okKy45emU/hqdefault.jpg"
    },
    {
        "id": 9,
        "titulo": "Como abrir uma empresa: aspectos legais - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/2GB6df_7OAA",
        "thumbnail": "https://img.youtube.com/vi/2GB6df_7OAA/hqdefault.jpg"
    },
    {
        "id": 10,
        "titulo": "Entendendo o processo de usucapião - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/H72EIFW9XXI",
        "thumbnail": "https://img.youtube.com/vi/H72EIFW9XXI/hqdefault.jpg"
    },
    {
        "id": 11,
        "titulo": "Como lidar com multas de trânsito - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/hF3GsU8Ib4g",
        "thumbnail": "https://img.youtube.com/vi/hF3GsU8Ib4g/hqdefault.jpg"
    },
    {
        "id": 12,
        "titulo": "Direito previdenciário: aposentadoria e benefícios - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/NA8KqU-mAdQ",
        "thumbnail": "https://img.youtube.com/vi/NA8KqU-mAdQ/hqdefault.jpg"
    },
    {
        "id": 13,
        "titulo": "Como funciona o processo de adoção - Direito Para Leigos",
        "url": "https://www.youtube.com/embed/XOGTYxoNsBI",
        "thumbnail": "https://img.youtube.com/vi/XOGTYxoNsBI/hqdefault.jpg"
    }
];
