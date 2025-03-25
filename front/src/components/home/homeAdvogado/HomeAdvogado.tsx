import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Progress } from "@radix-ui/react-progress";
import { useResponsive } from "@/hooks/useResponsive";

export function HomeAdvogado() {
    const { isMobile } = useResponsive();

    if (isMobile) {
        return <MobileView />;
    }

    return <DesktopView />;
}

function DesktopView() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
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
                            <CardTitle>Documentos Pendentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">7</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimento Mensal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">R$ 15.400</p>
                            <p className="text-sm text-muted-foreground">+8% em relação ao mês anterior</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Atividades Recentes e Prazos */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Atividades Recentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Atividades Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Caso</TableHead>
                                        <TableHead>Atividade</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Processo #12345</TableCell>
                                        <TableCell>Petição enviada</TableCell>
                                        <TableCell>Hoje, 10:30</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Processo #54321</TableCell>
                                        <TableCell>Audiência agendada</TableCell>
                                        <TableCell>Ontem, 14:20</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Processo #98765</TableCell>
                                        <TableCell>Documentos adicionados</TableCell>
                                        <TableCell>15/03, 09:45</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Próximos Prazos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Prazos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Caso</TableHead>
                                        <TableHead>Prazo</TableHead>
                                        <TableHead>Data Limite</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="bg-red-50">
                                        <TableCell>Processo #12345</TableCell>
                                        <TableCell>Recurso</TableCell>
                                        <TableCell>Amanhã, 23:59</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Processo #67890</TableCell>
                                        <TableCell>Contestação</TableCell>
                                        <TableCell>Em 3 dias</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Processo #24680</TableCell>
                                        <TableCell>Alegações finais</TableCell>
                                        <TableCell>Em 5 dias</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MobileView() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="min-h-fit-content">
                {/* Carrossel */}
                <section className="p-3">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Card className="bg-card shadow-md min-h-36">
                                    <CardHeader>
                                        <CardTitle>Processos ativos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <div className="text-3xl font-bold mr-4">12</div>
                                            <div className="text-sm">
                                                <div>+2 novos esta semana</div>
                                                <Progress className="h-2 w-full bg-gray-200" value={65} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem>
                                <Card className="bg-card shadow-md min-h-36">
                                    <CardHeader>
                                        <CardTitle>Prazos próximos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <div className="text-3xl font-bold mr-4 text-red-500">2</div>
                                            <div className="text-sm">
                                                <div>Vencendo esta semana</div>
                                                <Progress className="h-2 w-full bg-gray-200" value={25} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Cards de Ação Rápida */}
                <section className="p-3">
                    <h2 className="text-lg font-bold mb-2">Próximos Prazos</h2>
                    <Card className="mb-3 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Recurso - Processo #12345</h3>
                                    <p className="text-sm text-muted-foreground">Cliente: João Silva</p>
                                </div>
                                <div className="text-red-500 text-sm font-bold">Amanhã</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mb-3">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Contestação - Processo #67890</h3>
                                    <p className="text-sm text-muted-foreground">Cliente: Maria Santos</p>
                                </div>
                                <div className="text-sm">Em 3 dias</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Atalhos */}
                <section className="p-3 mb-16">
                    <h2 className="text-lg font-bold mb-2">Atalhos</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl mb-2">📋</div>
                                <div className="text-sm font-medium">Novos Casos</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl mb-2">💼</div>
                                <div className="text-sm font-medium">Documentos</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl mb-2">⏰</div>
                                <div className="text-sm font-medium">Agenda</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="text-2xl mb-2">💰</div>
                                <div className="text-sm font-medium">Finanças</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
} 