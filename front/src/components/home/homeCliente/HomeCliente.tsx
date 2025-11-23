"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { 
    Calendar, 
    Book, 
    Briefcase, 
    FileText, 
    CheckCircle, 
    Clock,
    AlertTriangle,
    User,
    Shield,
    Activity,
    Plus,
    Download
} from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
import AuthGuard from "@/components/auth/AuthGuard";

export function HomeCliente() {

    const { updateConfig } = useLayout();

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: false,
            showFooter: true
        });
    }, [updateConfig]);

    return <AuthGuard>
             <DesktopView />
           </AuthGuard>
}

function DesktopView() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header com boas-vindas */}
            <div className="bg-card border-b border px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Olá! Como posso ajudá-lo hoje?</h1>
                        <p className="text-muted-foreground">Acompanhe seus processos e mantenha-se informado</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-dashboard-card-blue text-dashboard-blue px-3 py-1 rounded-full text-sm font-medium">
                            <Shield className="w-4 h-4 inline mr-1" />
                            Protegido
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* KPIs principais */}
                <section className="grid grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-dashboard-blue border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-blue-light text-sm font-medium">Processos Ativos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">5</p>
                                    <p className="text-dashboard-card-blue-light text-xs">Em andamento</p>
                                </div>
                                <div className="bg-white/20 dark:bg-blue-400/40 p-3 rounded-full">
                                    <Briefcase className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-dashboard-orange border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-orange-light text-sm font-medium">Próximos Compromissos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">2</p>
                                    <p className="text-dashboard-card-orange-light text-xs">Esta semana</p>
                                </div>
                                <div className="bg-white/20 dark:bg-red-400/40 p-3 rounded-full">
                                    <Calendar className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-dashboard-yellow border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-yellow-light text-sm font-medium">Documentos Pendentes</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">3</p>
                                    <p className="text-dashboard-card-yellow-light text-xs">Para enviar</p>
                                </div>
                                <div className="bg-white/20 dark:bg-orange-400/40 p-3 rounded-full">
                                    <FileText className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-dashboard-green border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-green-light text-sm font-medium">Status Geral</p>
                                    <div className="flex items-center mt-2">
                                        <CheckCircle className="w-6 h-6 mr-2 text-dashboard-card-primary" />
                                        <p className="text-xl font-bold text-dashboard-card-primary">Em dia</p>
                                    </div>
                                    <p className="text-dashboard-card-green-light text-xs">Tudo atualizado</p>
                                </div>
                                <div className="bg-white/20 dark:bg-emerald-400/40 p-3 rounded-full">
                                    <Shield className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Seção principal com processos e compromissos */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Meus Processos */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-blue border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Briefcase className="w-5 h-5 mr-2 text-dashboard-blue" />
                                Meus Processos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                <div className="flex items-center space-x-4 p-4 bg-dashboard-card-green rounded-lg border-l-4 border-dashboard-green">
                                    <div className="bg-dashboard-card-green p-2 rounded-full">
                                        <Activity className="w-4 h-4 text-dashboard-green" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Trabalhista #12345</p>
                                        <p className="text-sm text-muted-foreground">Dr. Carlos Silva</p>
                                    </div>
                                    <span className="text-dashboard-green text-sm font-medium bg-dashboard-card-green px-2 py-1 rounded">Em andamento</span>
                                </div>
                                
                                <div className="flex items-center space-x-4 p-4 bg-dashboard-card-blue rounded-lg border-l-4 border-dashboard-blue">
                                    <div className="bg-dashboard-card-blue p-2 rounded-full">
                                        <Clock className="w-4 h-4 text-dashboard-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Previdenciário #54321</p>
                                        <p className="text-sm text-muted-foreground">Dra. Maria Santos</p>
                                    </div>
                                    <span className="text-dashboard-blue text-sm font-medium bg-dashboard-card-blue px-2 py-1 rounded">Aguardando</span>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-dashboard-card-yellow rounded-lg border-l-4 border-dashboard-yellow">
                                    <div className="bg-dashboard-card-yellow p-2 rounded-full">
                                        <FileText className="w-4 h-4 text-dashboard-yellow" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Civil #98765</p>
                                        <p className="text-sm text-muted-foreground">Dr. João Almeida</p>
                                    </div>
                                    <span className="text-dashboard-yellow text-sm font-medium bg-dashboard-card-yellow px-2 py-1 rounded">Análise</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximos Compromissos */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-orange border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Calendar className="w-5 h-5 mr-2 text-dashboard-orange" />
                                Próximos Compromissos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                <div className="flex items-center justify-between p-4 bg-dashboard-card-red rounded-lg border border-dashboard-red">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-dashboard-card-red p-2 rounded-full">
                                            <AlertTriangle className="w-4 h-4 text-dashboard-red" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Audiência Trabalhista</p>
                                            <p className="text-sm text-muted-foreground">Dr. Carlos Silva</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-red">Amanhã</p>
                                        <p className="text-xs text-dashboard-red">14:30</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-dashboard-card-blue rounded-lg border border-dashboard-blue">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-dashboard-card-blue p-2 rounded-full">
                                            <User className="w-4 h-4 text-dashboard-blue" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Reunião com Advogado</p>
                                            <p className="text-sm text-muted-foreground">Dra. Maria Santos</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-blue">Em 3 dias</p>
                                        <p className="text-xs text-dashboard-blue">10:00</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-dashboard-card-green rounded-lg border border-dashboard-green">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-dashboard-card-green p-2 rounded-full">
                                            <FileText className="w-4 h-4 text-dashboard-green" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Entrega de Documentos</p>
                                            <p className="text-sm text-muted-foreground">Protocolo geral</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-green">Em 5 dias</p>
                                        <p className="text-xs text-dashboard-green">09:00</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <section className="grid grid-cols-4 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => window.location.href = "/processos/novo"}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-blue-light p-4 rounded-full mb-4">
                                <Plus className="w-8 h-8 text-dashboard-blue" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Novo Processo</h3>
                            <p className="text-sm text-muted-foreground">Iniciar um novo processo jurídico</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => window.location.href = "/agenda"}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-green-light p-4 rounded-full mb-4">
                                <Calendar className="w-8 h-8 text-dashboard-green" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Agendar Consulta</h3>
                            <p className="text-sm text-muted-foreground">Marcar reunião com advogado</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md"  onClick={() => window.location.href = "/biblioteca"}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-purple-light p-4 rounded-full mb-4">
                                <Book className="w-8 h-8 text-dashboard-purple" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Biblioteca Jurídica</h3>
                            <p className="text-sm text-muted-foreground">Acesso a documentos e leis</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => window.location.href = "/conta"}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-orange-light p-4 rounded-full mb-4">
                                <Download className="w-8 h-8 text-dashboard-orange" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Meus Documentos</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar documentos pessoais</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
