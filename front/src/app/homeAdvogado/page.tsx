"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChatAvocuss } from "@/components/home/comum/chatAvocuss";
import { NavbarWeb } from "@/components/comum/navbarWeb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function HomeAdvogado() {
    const [chatOpen, setChatOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                {/* Navbar */}
                <nav className="w-full p-4 bg-secondary text-secondary-foreground flex justify-between items-center rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="/avatar.jpg" alt="Advogado" />
                            <AvatarFallback>ADV</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-lg font-bold">Dr. Silva</h1>
                            <p className="text-xs text-secondary-foreground">Casos ativos: 5</p>
                            <p className="text-xs text-secondary-foreground">Avaliação: 4.9/5</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" size="icon">📩</Button>
                        <Button variant="ghost" size="icon">⚙️</Button>
                    </div>
                </nav>

                <div className="min-h-fit-content">
                    {/* Carrossel */}
                    <section className="p-3">
                        <Carousel className="w-full">
                            <CarouselContent>
                                <CarouselItem style={{ backgroundImage: 'url(./bg-mobile.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <Card className="bg-card shadow-md min-h-44" style={{ background: 'linear-gradient(90deg, var(--reverse), rgba(0,0,0,0) 100%)' }}>
                                        <CardHeader>
                                            <CardTitle>Gestão de Casos</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Centralize todos os seus casos em um só lugar.</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem style={{ backgroundImage: 'url(./carrossel1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <Card className="bg-card shadow-md min-h-44" style={{ background: 'linear-gradient(90deg, var(--reverse), rgba(0,0,0,0) 100%)' }}>
                                        <CardHeader>
                                            <CardTitle>Chat com IA</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Resolva dúvidas rápidas com o assistente virtual.</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </section>

                    {/* Resumo de Casos */}
                    <section className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Casos Ativos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">5</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Próximos Prazos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">3</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Ferramentas Rápidas */}
                    <section className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Button className="bg-primary text-primary-foreground p-4">
                                Adicionar Caso
                            </Button>
                            <Button className="bg-secondary text-secondary-foreground p-4">
                                Enviar Documentos
                            </Button>
                        </div>
                    </section>

                    {/* Linha do Tempo */}
                    <section className="p-6">
                        <h2 className="text-xl font-bold mb-4">Próximos Prazos</h2>
                        <div className="space-y-4">
                            {timeline.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{item.date}</p>
                                        <Progress value={item.progress} className="h-2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer de Navegação */}
                <footer className="w-full fixed bottom-0 bg-secondary text-secondary-foreground flex justify-around p-3 rounded-t-2xl">
                    <Button variant="ghost">Casos</Button>
                    <Button variant="ghost">Chat</Button>
                    <Button variant="ghost">Perfil</Button>
                </footer>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                {/* Navbar */}
                <NavbarWeb />

                {/* Dashboard */}
                <div className="flex-1 p-8">
                    {/* Resumo de Casos */}
                    <section className="grid grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Casos Ativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">12</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Próximos Prazos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">3</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Avaliação Média</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">4.8/5</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Novas Mensagens</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">5</p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Linha do Tempo e Métricas */}
                    <section className="grid grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Próximos Prazos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Caso</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Progresso</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {timeline.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <Progress value={item.progress} className="h-2" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Métricas de Desempenho</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p>Casos Ganhos: <span className="font-bold">8</span></p>
                                        <Progress value={80} className="h-2" />
                                    </div>
                                    <div>
                                        <p>Tempo Médio de Resolução: <span className="font-bold">30 dias</span></p>
                                        <Progress value={60} className="h-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Lista de Casos Recentes */}
                    <section className="mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Casos Recentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Caso</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Última Atualização</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentCases.map((caseItem, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{caseItem.case}</TableCell>
                                                <TableCell>{caseItem.client}</TableCell>
                                                <TableCell>{caseItem.status}</TableCell>
                                                <TableCell>{caseItem.lastUpdate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Chat com IA */}
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    💬
                </button>
                <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
            </div>
        );
    }
}

// Dados mockados
const timeline = [
    { title: "Caso XYZ", date: "10/11/2023", progress: 70 },
    { title: "Caso ABC", date: "15/11/2023", progress: 50 },
    { title: "Caso DEF", date: "20/11/2023", progress: 30 },
];

const recentCases = [
    { case: "Caso XYZ", client: "Cliente A", status: "Em andamento", lastUpdate: "05/11/2023" },
    { case: "Caso ABC", client: "Cliente B", status: "Concluído", lastUpdate: "01/11/2023" },
    { case: "Caso DEF", client: "Cliente C", status: "Aguardando", lastUpdate: "25/10/2023" },
];