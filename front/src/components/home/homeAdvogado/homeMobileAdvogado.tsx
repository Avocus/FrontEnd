import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Progress } from "@radix-ui/react-progress";

export function HomeMobileAdvogado() {
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
}

// Dados mockados
const timeline = [
    { title: "Caso XYZ", date: "10/11/2023", progress: 70 },
    { title: "Caso ABC", date: "15/11/2023", progress: 50 },
    { title: "Caso DEF", date: "20/11/2023", progress: 30 },
];
