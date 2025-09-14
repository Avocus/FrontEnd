"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Progress } from "@radix-ui/react-progress";
import { useEffect } from "react";
import { Calendar, Book, Briefcase, FileText, CheckCircle } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";

export function HomeCliente() {

    const { updateConfig } = useLayout();

    const { updateAuth } = useAuth();
    useEffect(() => {
        updateAuth({
            requireAuth: true,
            redirectTo: "/login"
        });
    }, [updateAuth]);

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: false,
            showFooter: true
        });
    }, [updateConfig]);

    const { isMobile } = useResponsive();

    if (isMobile) {
        return <AuthGuard>
                <MobileView />
               </AuthGuard>
    }

    return <AuthGuard>
             <DesktopView />
           </AuthGuard>
}

function DesktopView() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* Resumo dos Casos */}
                <section className="grid grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Processos Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">5</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Compromissos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">2</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentos Pendentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">3</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Geral</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <p className="text-lg font-bold">Em dia</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Histórico de Processos e Próximos Compromissos */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Histórico de Processos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Meus Processos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Processo</TableHead>
                                        <TableHead>Advogado</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Trabalhista #12345</TableCell>
                                        <TableCell>Dr. Carlos Silva</TableCell>
                                        <TableCell>
                                            <span className="text-green-600 font-medium">Em andamento</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Previdenciário #54321</TableCell>
                                        <TableCell>Dra. Maria Santos</TableCell>
                                        <TableCell>
                                            <span className="text-blue-600 font-medium">Aguardando</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Civil #98765</TableCell>
                                        <TableCell>Dr. João Almeida</TableCell>
                                        <TableCell>
                                            <span className="text-yellow-600 font-medium">Análise</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Próximos Compromissos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Compromissos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Evento</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Horário</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="bg-yellow-50">
                                        <TableCell>Audiência Trabalhista</TableCell>
                                        <TableCell>Amanhã</TableCell>
                                        <TableCell>14:30</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Reunião com Advogado</TableCell>
                                        <TableCell>Em 3 dias</TableCell>
                                        <TableCell>10:00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Entrega de Documentos</TableCell>
                                        <TableCell>Em 5 dias</TableCell>
                                        <TableCell>09:00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <section className="grid grid-cols-4 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <FileText className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-2">Novo Processo</h3>
                            <p className="text-sm text-muted-foreground">Iniciar um novo processo jurídico</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Calendar className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-2">Agendar Consulta</h3>
                            <p className="text-sm text-muted-foreground">Marcar reunião com advogado</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Book className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-2">Biblioteca Jurídica</h3>
                            <p className="text-sm text-muted-foreground">Acesso a documentos e leis</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Briefcase className="w-8 h-8 text-primary mb-3" />
                            <h3 className="font-semibold mb-2">Meus Documentos</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar documentos pessoais</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function MobileView() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="min-h-fit-content">
                {/* Carrossel com Resumo */}
                <section className="p-3">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Card className="bg-card shadow-md min-h-36">
                                    <CardHeader>
                                        <CardTitle>Processos Ativos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <div className="text-3xl font-bold mr-4">5</div>
                                            <div className="text-sm">
                                                <div>+1 novo esta semana</div>
                                                <Progress className="h-2 w-full bg-gray-200" value={75} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem>
                                <Card className="bg-card shadow-md min-h-36">
                                    <CardHeader>
                                        <CardTitle>Próximos Compromissos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <div className="text-3xl font-bold mr-4 text-orange-500">2</div>
                                            <div className="text-sm">
                                                <div>Esta semana</div>
                                                <Progress className="h-2 w-full bg-gray-200" value={40} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Próximos Compromissos */}
                <section className="p-3">
                    <h2 className="text-lg font-bold mb-2">Próximos Compromissos</h2>
                    <Card className="mb-3 bg-yellow-50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Audiência Trabalhista</h3>
                                    <p className="text-sm text-muted-foreground">Dr. Carlos Silva - 14:30</p>
                                </div>
                                <div className="text-orange-500 text-sm font-bold">Amanhã</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mb-3">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Reunião com Advogado</h3>
                                    <p className="text-sm text-muted-foreground">Dra. Maria Santos - 10:00</p>
                                </div>
                                <div className="text-sm">Em 3 dias</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Meus Processos */}
                <section className="p-3">
                    <h2 className="text-lg font-bold mb-2">Meus Processos</h2>
                    <Card className="mb-3">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Trabalhista #12345</h3>
                                    <p className="text-sm text-muted-foreground">Dr. Carlos Silva</p>
                                </div>
                                <span className="text-green-600 text-sm font-medium">Em andamento</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mb-3">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">Previdenciário #54321</h3>
                                    <p className="text-sm text-muted-foreground">Dra. Maria Santos</p>
                                </div>
                                <span className="text-blue-600 text-sm font-medium">Aguardando</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Ações Rápidas */}
                <section className="p-3 mb-16">
                    <h2 className="text-lg font-bold mb-2">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <FileText className="w-6 h-6 mb-2 text-primary" />
                                <div className="text-sm font-medium text-center">Novo Processo</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <Calendar className="w-6 h-6 mb-2 text-primary" />
                                <div className="text-sm font-medium text-center">Agendar</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <Book className="w-6 h-6 mb-2 text-primary" />
                                <div className="text-sm font-medium text-center">Biblioteca</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <Briefcase className="w-6 h-6 mb-2 text-primary" />
                                <div className="text-sm font-medium text-center">Documentos</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}