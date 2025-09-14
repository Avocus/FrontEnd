import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useResponsive } from "@/hooks/useResponsive";
import { 
    Briefcase, 
    Clock, 
    FileText, 
    DollarSign, 
    TrendingUp, 
    AlertTriangle, 
    Calendar, 
    Users, 
    CheckCircle2, 
    Send,
    FolderOpen,
    Timer,
    Plus,
    BarChart3,
    Target,
    Activity
} from "lucide-react";

export function HomeAdvogado() {
    const { isMobile } = useResponsive();

    if (isMobile) {
        return <MobileView />;
    }

    return <DesktopView />;
}

function DesktopView() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header com boas-vindas */}
            <div className="bg-background border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-foreground">Bem-vindo de volta!</h1>
                        <p className="text-primary-foreground">Aqui está um resumo da sua prática jurídica hoje</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-dashboard-card-green text-dashboard-green px-3 py-1 rounded-full text-sm font-medium">
                            <Activity className="w-4 h-4 inline mr-1" />
                            Sistema Ativo
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
                                    <p className="text-dashboard-card-blue-light text-sm font-medium">Casos Ativos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">12</p>
                                    <p className="text-dashboard-card-blue-light text-xs">+2 este mês</p>
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
                                    <p className="text-dashboard-card-orange-light text-sm font-medium">Próximos Prazos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">3</p>
                                    <p className="text-dashboard-card-orange-light text-xs">Urgente</p>
                                </div>
                                <div className="bg-white/20 dark:bg-red-400/40 p-3 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-dashboard-yellow border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-yellow-light text-sm font-medium">Documentos Pendentes</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">7</p>
                                    <p className="text-dashboard-card-yellow-light text-xs">Para revisar</p>
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
                                    <p className="text-dashboard-card-green-light text-sm font-medium">Rendimento Mensal</p>
                                    <p className="text-2xl font-bold text-dashboard-card-primary">R$ 15.400</p>
                                    <div className="flex items-center text-dashboard-card-green-light text-xs">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +8% vs mês anterior
                                    </div>
                                </div>
                                <div className="bg-white/20 dark:bg-emerald-400/40 p-3 rounded-full">
                                    <DollarSign className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Seção principal com atividades e prazos */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Atividades Recentes */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-blue border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Activity className="w-5 h-5 mr-2 text-dashboard-blue" />
                                Atividades Recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                <div className="flex items-center space-x-4 p-3 bg-dashboard-card-green rounded-lg border-l-4 border-dashboard-green">
                                    <div className="bg-dashboard-card-green p-2 rounded-full">
                                        <Send className="w-4 h-4 text-dashboard-green" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Processo #12345</p>
                                        <p className="text-sm text-muted-foreground">Petição enviada</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Hoje, 10:30</div>
                                </div>
                                
                                <div className="flex items-center space-x-4 p-3 bg-dashboard-card-blue rounded-lg border-l-4 border-dashboard-blue">
                                    <div className="bg-dashboard-card-blue p-2 rounded-full">
                                        <Calendar className="w-4 h-4 text-dashboard-blue" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Processo #54321</p>
                                        <p className="text-sm text-muted-foreground">Audiência agendada</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Ontem, 14:20</div>
                                </div>

                                <div className="flex items-center space-x-4 p-3 bg-dashboard-card-purple rounded-lg border-l-4 border-dashboard-purple">
                                    <div className="bg-dashboard-card-purple p-2 rounded-full">
                                        <FolderOpen className="w-4 h-4 text-dashboard-purple" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">Processo #98765</p>
                                        <p className="text-sm text-muted-foreground">Documentos adicionados</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">15/03, 09:45</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximos Prazos */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-red border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Timer className="w-5 h-5 mr-2 text-dashboard-red" />
                                Próximos Prazos
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
                                            <p className="font-medium text-foreground">Processo #12345</p>
                                            <p className="text-sm text-muted-foreground">Recurso</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-red">Amanhã</p>
                                        <p className="text-xs text-dashboard-red">23:59</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-dashboard-card-yellow rounded-lg border border-dashboard-yellow">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-dashboard-card-yellow p-2 rounded-full">
                                            <Clock className="w-4 h-4 text-dashboard-yellow" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Processo #67890</p>
                                            <p className="text-sm text-muted-foreground">Contestação</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-yellow">Em 3 dias</p>
                                        <p className="text-xs text-dashboard-yellow">16/09</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-dashboard-card-green rounded-lg border border-dashboard-green">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-dashboard-card-green p-2 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-dashboard-green" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Processo #24680</p>
                                            <p className="text-sm text-muted-foreground">Alegações finais</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-dashboard-green">Em 5 dias</p>
                                        <p className="text-xs text-dashboard-green">19/09</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <section className="grid grid-cols-4 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-blue-light p-4 rounded-full mb-4">
                                <Plus className="w-8 h-8 text-dashboard-blue" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Novo Caso</h3>
                            <p className="text-sm text-muted-foreground">Criar um novo processo</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-green-light p-4 rounded-full mb-4">
                                <Calendar className="w-8 h-8 text-dashboard-green" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Agenda</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar compromissos</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-purple-light p-4 rounded-full mb-4">
                                <Users className="w-8 h-8 text-dashboard-purple" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Clientes</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar clientes</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-orange-light p-4 rounded-full mb-4">
                                <BarChart3 className="w-8 h-8 text-dashboard-orange" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Relatórios</h3>
                            <p className="text-sm text-muted-foreground">Análises e métricas</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function MobileView() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header mobile */}
            <div className="bg-card shadow-sm px-4 py-6 border-b">
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Gerencie sua prática jurídica</p>
            </div>

            <div className="min-h-fit-content">
                {/* Carrossel com KPIs */}
                <section className="p-4">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Card className="bg-gradient-dashboard-blue shadow-lg min-h-36">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-dashboard-card-blue-light text-sm">Processos ativos</p>
                                                <div className="text-3xl font-bold text-dashboard-card-primary">12</div>
                                                <div className="flex items-center text-dashboard-card-blue-light text-xs mt-1">
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    +2 novos esta semana
                                                </div>
                                            </div>
                                            <div className="bg-blue-400/60 dark:bg-blue-400/40 p-3 rounded-full">
                                                <Briefcase className="w-6 h-6 text-dashboard-card-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem>
                                <Card className="bg-gradient-dashboard-orange shadow-lg min-h-36">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-dashboard-card-orange-light text-sm">Prazos próximos</p>
                                                <div className="text-3xl font-bold text-dashboard-card-primary">3</div>
                                                <div className="flex items-center text-dashboard-card-orange-light text-xs mt-1">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Vencendo esta semana
                                                </div>
                                            </div>
                                            <div className="bg-red-400/60 dark:bg-red-400/40 p-3 rounded-full">
                                                <Timer className="w-6 h-6 text-dashboard-card-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem>
                                <Card className="bg-gradient-dashboard-green shadow-lg min-h-36">
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-dashboard-card-green-light text-sm">Rendimento</p>
                                                <div className="text-2xl font-bold text-dashboard-card-primary">R$ 15.4k</div>
                                                <div className="flex items-center text-dashboard-card-green-light text-xs mt-1">
                                                    <DollarSign className="w-3 h-3 mr-1" />
                                                    +8% este mês
                                                </div>
                                            </div>
                                            <div className="bg-green-400/60 dark:bg-green-400/40 p-3 rounded-full">
                                                <BarChart3 className="w-6 h-6 text-dashboard-card-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Próximos Prazos */}
                <section className="p-4">
                    <div className="flex items-center mb-3">
                        <Timer className="w-5 h-5 mr-2 text-dashboard-red" />
                        <h2 className="text-lg font-bold text-foreground">Próximos Prazos</h2>
                    </div>
                    
                    <Card className="mb-3 bg-dashboard-red-light border border-dashboard-red shadow-md">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-dashboard-red-light p-2 rounded-full">
                                        <AlertTriangle className="w-4 h-4 text-dashboard-red" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Recurso - Processo #12345</h3>
                                        <p className="text-sm text-muted-foreground">Cliente: João Silva</p>
                                    </div>
                                </div>
                                <div className="text-dashboard-red text-sm font-bold">Amanhã</div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="mb-3 bg-dashboard-yellow-light border border-dashboard-yellow shadow-md">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-dashboard-yellow-light p-2 rounded-full">
                                        <Clock className="w-4 h-4 text-dashboard-yellow" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Contestação - Processo #67890</h3>
                                        <p className="text-sm text-muted-foreground">Cliente: Maria Santos</p>
                                    </div>
                                </div>
                                <div className="text-dashboard-yellow text-sm font-bold">Em 3 dias</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Ações Rápidas */}
                <section className="p-4 mb-16">
                    <div className="flex items-center mb-3">
                        <Target className="w-5 h-5 mr-2 text-dashboard-blue" />
                        <h2 className="text-lg font-bold text-foreground">Ações Rápidas</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-blue-light p-3 rounded-full mb-2">
                                    <Plus className="w-6 h-6 text-dashboard-blue" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Novos Casos</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-green-light p-3 rounded-full mb-2">
                                    <Calendar className="w-6 h-6 text-dashboard-green" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Agenda</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-purple-light p-3 rounded-full mb-2">
                                    <Users className="w-6 h-6 text-dashboard-purple" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Clientes</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0">
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-orange-light p-3 rounded-full mb-2">
                                    <BarChart3 className="w-6 h-6 text-dashboard-orange" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Relatórios</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
} 