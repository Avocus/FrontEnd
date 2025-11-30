
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Content {
    id: number;
    titulo: string;
    url: string;
    thumbnail: string;
}

export function Videoteca () {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const filteredVideos = videos.filter((video) =>
        video.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function loadYouTubeAPI(): Promise<void> {
            if ((window as any).YT && (window as any).YT.Player) return Promise.resolve();
            return new Promise((resolve) => {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(tag);
                (window as any).onYouTubeIframeAPIReady = () => resolve();
            });
        }

        let mounted = true;

        if (!selectedVideo) return;

        loadYouTubeAPI().then(() => {
            if (!mounted) return;
            try {
                const parts = selectedVideo.url.split('/embed/');
                const videoId = parts.length > 1 ? parts[1].split(/[?&]/)[0] : selectedVideo.url;

                playerRef.current = new (window as any).YT.Player('yt-player', {
                    height: '100%',
                    width: '100%',
                    videoId,
                    playerVars: {
                        controls: 0,
                        rel: 0,
                        modestbranding: 1,
                        disablekb: 1,
                        iv_load_policy: 3,
                        playsinline: 1,
                    },
                    events: {
                        onStateChange: (e: any) => {
                            const YT = (window as any).YT;
                            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
                            else setIsPlaying(false);
                        },
                    },
                });

                // garantir atributos de allow no iframe
                const checkIframe = setInterval(() => {
                    if (!playerRef.current) return;
                    const iframe = playerRef.current.getIframe && playerRef.current.getIframe();
                    if (iframe) {
                        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
                        iframe.setAttribute('allowfullscreen', '');
                        clearInterval(checkIframe);
                    }
                }, 200);
            } catch (err) {
                console.error('Erro ao inicializar player YouTube', err);
            }
        });

        return () => {
            mounted = false;
            if (playerRef.current && playerRef.current.destroy) {
                try { playerRef.current.destroy(); } catch { /* ignore */ }
            }
            playerRef.current = null;
        };
    }, [selectedVideo]);

    const togglePlayPause = () => {
        if (!playerRef.current) return;
        const YT = (window as any).YT;
        const state = playerRef.current.getPlayerState();
        if (state === YT.PlayerState.PLAYING) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
    };

    const forwardSeconds = (secs: number) => {
        if (!playerRef.current) return;
        const curr = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(curr + secs, true);
    };

    const backSeconds = (secs: number) => {
        if (!playerRef.current) return;
        const curr = playerRef.current.getCurrentTime();
        const target = Math.max(0, curr - secs);
        playerRef.current.seekTo(target, true);
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        try {
            if (document.fullscreenElement) {
                if (document.exitFullscreen) await document.exitFullscreen();
                else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
            } else {
                if (containerRef.current.requestFullscreen) await containerRef.current.requestFullscreen();
                else if ((containerRef.current as any).webkitRequestFullscreen) (containerRef.current as any).webkitRequestFullscreen();
            }
        } catch (err) {
            console.error('Erro ao alternar tela cheia', err);
        }
    };

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const closePlayer = () => {
        if (playerRef.current && playerRef.current.stopVideo) playerRef.current.stopVideo();
        setSelectedVideo(null);
    };

    return (
        <div className="p-8 bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-6">Videoteca Jurídica</h1>

            {/* Barra de Busca */}
            <div className="mb-8">
                <Input
                    placeholder="Buscar vídeos por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md"
                />
            </div>

            {/* Lista de Vídeos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <Image
                                src={video.thumbnail}
                                alt={video.titulo}
                                className="w-full h-48 object-cover rounded-lg"
                                width={320}
                                height={80}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Reprodutor de Vídeo */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>{selectedVideo.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div ref={containerRef} className="relative w-full h-96 bg-black">
                                {/* Player gerenciado pela IFrame API do YouTube */}
                                <div id="yt-player" className="w-full h-full" />

                                {/* Overlay com controles customizados (bloqueia interações do iframe) */}
                                <div className="absolute inset-0 pointer-events-auto flex items-end justify-center p-4">
                                    <div className="bg-black bg-opacity-40 rounded-md p-2 flex gap-3">
                                        <Button onClick={() => backSeconds(10)} variant="primary">
                                            Voltar 10s
                                        </Button>
                                        <Button onClick={() => togglePlayPause()} variant="primary">
                                            {isPlaying ? "Pausar" : "Play"}
                                        </Button>
                                        <Button onClick={() => forwardSeconds(10)} variant="primary">
                                            Avançar 10s
                                        </Button>
                                        <Button onClick={() => toggleFullscreen()} variant="primary">
                                            {isFullscreen ? 'Sair tela cheia' : 'Tela cheia'}
                                        </Button>
                                        <Button variant="secondary" onClick={() => closePlayer()}>
                                            Fechar
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
