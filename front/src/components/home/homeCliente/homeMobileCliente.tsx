import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChatAvocuss } from "../../comum/chatAvocuss";
import { useState } from "react";
import { Calendar, Book, Briefcase, Video } from "lucide-react";

export function HomeMobileCliente() {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground" >
            <div className="min-h-fit-content">
                {/* Carrossel */}
                <section className="p-3">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Card className=" bg-card shadow-md min-h-44 text-slate-800" style={{ backgroundImage: 'url(./carroussel-neutro.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <CardHeader>
                                        <CardTitle>Como entrar com um processo?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Saiba os passos para abrir um processo com rapidez e segurança.</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem>
                                <Card className=" bg-card shadow-md min-h-44 text-slate-800" style={{ backgroundImage: 'url(./carroussel-neutro-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <CardHeader>
                                        <CardTitle>Consultoria especializada</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Obtenha suporte jurídico com especialistas de confiança.</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </section>
                {/* Grid de Navegação */}
                <section className="p-6">
                    <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                        <Button variant="outline" className="flex flex-col items-center gap-2 p-6 bg-secondary hover:bg-secondary/80 transition-colors">
                            <Calendar className="w-6 h-6 text-secondary-foreground" />
                            <span className="text-xs text-secondary-foreground">Agenda</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center gap-2 p-6 bg-secondary hover:bg-secondary/80 transition-colors" onClick={() => window.location.href = "/biblioteca"}>
                            <Book className="w-6 h-6 text-secondary-foreground" />
                            <span className="text-xs text-secondary-foreground">Biblioteca</span>
                        </Button>
                        <Button disabled variant="outline" className="flex flex-col items-center gap-2 p-6 bg-secondary hover:bg-secondary/80 transition-colors">
                            <Briefcase className="w-6 h-6 text-secondary-foreground" />
                            <span className="text-xs text-secondary-foreground">Serviços</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center gap-2 p-6 bg-secondary hover:bg-secondary/80 transition-colors" onClick={() => window.location.href = "/videoteca"}>
                            <Video className="w-6 h-6 text-secondary-foreground" />
                            <span className="text-xs text-secondary-foreground">Videos</span>
                        </Button>
                    </div>
                </section>

                {/* Banner Assistente Virtual */}
                <section className="p-6 flex flex-col">
                    <div className="flex items-center gap-2">
                        <img src="/mr-avocuss-mascote.png" alt="Assistente" className="w-24 h-24" />
                        <div className="flex flex-col gap-2 items-center">
                            <h2 className="text-xl font-bold text-secondary-foreground">Sr. Avocuss</h2>
                            <p className="text-center text-secondary-foreground">Sempre à sua disposição para dúvidas rápidas!</p>
                        </div>
                    </div>
                    <Button className="mt-2 bg-secondary text-secondary-foreground" onClick={() => setChatOpen(true)}>
                        Conversar com Sr. Avocuss
                    </Button>
                    <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
                </section>
            </div>
        </div>
    );
}