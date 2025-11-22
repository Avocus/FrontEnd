/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useResponsive } from "@/hooks/useResponsive";
import { useNotificationStore, useCasoStore } from "@/store";
import { NotificacaoTipo } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
    BarChart3,
    Target,
    Activity,
} from "lucide-react";

interface CasoCliente {
  id: string;
  clienteId: string;
  clienteNome: string;
  titulo: string;
  tipoProcesso: string;
  descricao: string;
  situacaoAtual: string;
  objetivos: string;
  urgencia: "baixa" | "media" | "alta";
  documentosDisponiveis?: string;
  dataSolicitacao: string;
  status: "pendente" | "em_analise" | "aceito" | "rejeitado" | "aguardando_documentos" | "documentos_enviados" | "aguardando_analise_documentos" | "em_andamento" | "protocolado";
  advogadoNome?: string;
}

function useCasosPendentes() {
  const [casosPendentes, setCasosPendentes] = useState<CasoCliente[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addNotification } = useNotificationStore();
  const { casosCliente, casosNotificados, marcarCasoComoNotificado, carregarCasosCliente } = useCasoStore();
  
  useEffect(() => {
    // Hook inicializado - sem logs de debug
  }, [addNotification]);

  const verificarCasosPendentes = useCallback(() => {
    if (!isInitialized) return; // Aguardar inicialização completa

    try {
      // Usar dados da store em vez de localStorage
      const pendentes = casosCliente.filter((caso: CasoCliente) => caso.status === "pendente");

      // Verificar se há casos novos que ainda não foram notificados
      const casosNovos = pendentes.filter((caso: CasoCliente) => !casosNotificados.has(caso.id));

      if (casosNovos.length > 0) {
        const notificacao = {
          titulo: "Novos casos disponíveis",
          mensagem: `Você tem ${casosNovos.length} novo${casosNovos.length > 1 ? 's' : ''} caso${casosNovos.length > 1 ? 's' : ''} pendente${casosNovos.length > 1 ? 's' : ''} para análise`,
          tipo: NotificacaoTipo.INFO,
          link: "/casos"
        };

        // Adicionar notificação
        addNotification(notificacao);

        // Marcar os casos novos como notificados usando a store
        casosNovos.forEach(caso => marcarCasoComoNotificado(caso.id));
      }

      setCasosPendentes(pendentes);
    } catch (error) {
      console.error("Erro ao verificar casos pendentes:", error);
      setCasosPendentes([]);
    }
  }, [casosCliente, casosNotificados, marcarCasoComoNotificado, addNotification, isInitialized]);

  useEffect(() => {
    // Carregar dados da store e inicializar
    const carregarDados = async () => {
      await carregarCasosCliente();
      setIsInitialized(true);
    };
    carregarDados();
  }, [carregarCasosCliente]);

  useEffect(() => {
    verificarCasosPendentes();
    
    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "casoCliente") {
        verificarCasosPendentes();
      }
    };

    const handleCustomStorageChange = () => verificarCasosPendentes();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("casoClienteUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("casoClienteUpdated", handleCustomStorageChange);
    };
  }, [verificarCasosPendentes]);

  return { casosPendentes, totalPendentes: casosPendentes.length };
}

export function HomeAdvogado() {
    const { isMobile } = useResponsive();
    
    // Verificar casos pendentes - apenas uma vez no componente principal
    const { totalPendentes } = useCasosPendentes();

    if (isMobile) {
        return <MobileView totalPendentes={totalPendentes} />;
    }

    return <DesktopView totalPendentes={totalPendentes} />;
}

function DesktopView({ totalPendentes }: { totalPendentes: number }) {
    const router = useRouter();

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
                        {/* Indicador de casos pendentes */}
                        {totalPendentes > 0 && (
                            <div 
                                className="bg-dashboard-card-orange text-dashboard-orange px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => router.push("/casos")}
                            >
                                <AlertTriangle className="w-4 h-4 inline mr-1" />
                                {totalPendentes} caso{totalPendentes > 1 ? 's' : ''} pendente{totalPendentes > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* KPIs principais */}
                <section className="grid grid-cols-4 gap-6 mb-8">
                    <Card 
                        className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 ${
                            totalPendentes > 0 
                                ? 'bg-gradient-dashboard-orange' 
                                : 'bg-gradient-dashboard-blue'
                        }`}
                        onClick={() => router.push("/casos")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${
                                        totalPendentes > 0 
                                            ? 'text-dashboard-card-orange-light' 
                                            : 'text-dashboard-card-blue-light'
                                    }`}>
                                        {totalPendentes > 0 ? 'Casos Pendentes' : 'Casos Ativos'}
                                    </p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">
                                        {totalPendentes > 0 ? totalPendentes : '12'}
                                    </p>
                                    <p className={`text-xs ${
                                        totalPendentes > 0 
                                            ? 'text-dashboard-card-orange-light' 
                                            : 'text-dashboard-card-blue-light'
                                    }`}>
                                        {totalPendentes > 0 ? 'Aguardando análise' : '+2 este mês'}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${
                                    totalPendentes > 0 
                                        ? 'bg-white/20 dark:bg-orange-400/40' 
                                        : 'bg-white/20 dark:bg-blue-400/40'
                                }`}>
                                    {totalPendentes > 0 ? (
                                        <AlertTriangle className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                    ) : (
                                        <Briefcase className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                    )}
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
                    <Card 
                        className={`cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md relative ${
                            totalPendentes > 0 ? 'ring-2 ring-dashboard-orange' : ''
                        }`} 
                        onClick={() => router.push("/casos")}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            {totalPendentes > 0 && (
                                <div className="absolute -top-2 -right-2 bg-dashboard-orange text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                    {totalPendentes > 9 ? '9+' : totalPendentes}
                                </div>
                            )}
                            <div className={`p-4 rounded-full mb-4 ${
                                totalPendentes > 0 
                                    ? 'bg-dashboard-orange-light' 
                                    : 'bg-dashboard-blue-light'
                            }`}>
                                {totalPendentes > 0 ? (
                                    <AlertTriangle className="w-8 h-8 text-dashboard-orange" />
                                ) : (
                                    <Briefcase className="w-8 h-8 text-dashboard-blue" />
                                )}
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Casos</h3>
                            <p className="text-sm text-muted-foreground">
                                {totalPendentes > 0 
                                    ? `${totalPendentes} pendente${totalPendentes > 1 ? 's' : ''}` 
                                    : 'Gerenciar casos'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => router.push("/documentos")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-blue-light p-4 rounded-full mb-4">
                                <FileText className="w-8 h-8 text-dashboard-blue" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Documentos</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar documentos</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => router.push("/agenda")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-green-light p-4 rounded-full mb-4">
                                <Calendar className="w-8 h-8 text-dashboard-green" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Agenda</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar compromissos</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => router.push("/clientes")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-purple-light p-4 rounded-full mb-4">
                                <Users className="w-8 h-8 text-dashboard-purple" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Clientes</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar clientes</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function MobileView({ totalPendentes }: { totalPendentes: number }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background">
            {/* Header mobile */}
            <div className="bg-card shadow-sm px-4 py-6 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Gerencie sua prática jurídica</p>
                    </div>
                    {/* Indicador de casos pendentes mobile */}
                    {totalPendentes > 0 && (
                        <div 
                            className="bg-dashboard-card-orange text-dashboard-orange px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity flex items-center"
                            onClick={() => router.push("/casos")}
                        >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {totalPendentes}
                        </div>
                    )}
                </div>
            </div>

            <div className="min-h-fit-content">
                {/* Carrossel com KPIs */}
                <section className="p-4">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Card 
                                    className={`shadow-lg min-h-36 cursor-pointer hover:shadow-xl transition-shadow ${
                                        totalPendentes > 0 
                                            ? 'bg-gradient-dashboard-orange' 
                                            : 'bg-gradient-dashboard-blue'
                                    }`}
                                    onClick={() => router.push("/casos")}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`text-sm ${
                                                    totalPendentes > 0 
                                                        ? 'text-dashboard-card-orange-light' 
                                                        : 'text-dashboard-card-blue-light'
                                                }`}>
                                                    {totalPendentes > 0 ? 'Casos pendentes' : 'Processos ativos'}
                                                </p>
                                                <div className="text-3xl font-bold text-dashboard-card-primary">
                                                    {totalPendentes > 0 ? totalPendentes : '12'}
                                                </div>
                                                <div className={`flex items-center text-xs mt-1 ${
                                                    totalPendentes > 0 
                                                        ? 'text-dashboard-card-orange-light' 
                                                        : 'text-dashboard-card-blue-light'
                                                }`}>
                                                    {totalPendentes > 0 ? (
                                                        <>
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            Aguardando análise
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingUp className="w-3 h-3 mr-1" />
                                                            +2 novos esta semana
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-full ${
                                                totalPendentes > 0 
                                                    ? 'bg-orange-400/60 dark:bg-orange-400/40' 
                                                    : 'bg-blue-400/60 dark:bg-blue-400/40'
                                            }`}>
                                                {totalPendentes > 0 ? (
                                                    <AlertTriangle className="w-6 h-6 text-dashboard-card-primary" />
                                                ) : (
                                                    <Briefcase className="w-6 h-6 text-dashboard-card-primary" />
                                                )}
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
                        <Card 
                            className={`bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0 ${
                                totalPendentes > 0 ? 'ring-2 ring-dashboard-orange' : ''
                            }`} 
                            onClick={() => router.push("/casos")}
                        >
                            <CardContent className="p-4 flex flex-col items-center justify-center relative">
                                {totalPendentes > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-dashboard-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalPendentes > 9 ? '9+' : totalPendentes}
                                    </div>
                                )}
                                <div className={`p-3 rounded-full mb-2 ${
                                    totalPendentes > 0 
                                        ? 'bg-dashboard-orange-light' 
                                        : 'bg-dashboard-blue-light'
                                }`}>
                                    {totalPendentes > 0 ? (
                                        <AlertTriangle className="w-6 h-6 text-dashboard-orange" />
                                    ) : (
                                        <Briefcase className="w-6 h-6 text-dashboard-blue" />
                                    )}
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Casos</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0" onClick={() => router.push("/documentos")}>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-blue-light p-3 rounded-full mb-2">
                                    <FileText className="w-6 h-6 text-dashboard-blue" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Documentos</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0" onClick={() => router.push("/agenda")}>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-green-light p-3 rounded-full mb-2">
                                    <Calendar className="w-6 h-6 text-dashboard-green" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Agenda</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-md cursor-pointer hover:shadow-lg transition-shadow border-0" onClick={() => router.push("/clientes")}>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <div className="bg-dashboard-purple-light p-3 rounded-full mb-2">
                                    <Users className="w-6 h-6 text-dashboard-purple" />
                                </div>
                                <div className="text-sm font-medium text-center text-foreground">Clientes</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
} 