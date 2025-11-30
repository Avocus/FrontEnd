import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNotificationStore, useProcessoStore } from "@/store";
import { NotificacaoTipo, StatusProcesso } from "@/types";
import { ProcessoCliente } from "@/types/entities";
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
    Activity,
} from "lucide-react";
import { useProcessosDisponiveis } from "@/hooks/useProcessosDisponiveis";

function useProcessosDisponiveisCount() {
  const [totalDisponiveis, setTotalDisponiveis] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addNotification } = useNotificationStore();
  const { processos, fetchProcessosDisponiveis } = useProcessosDisponiveis();

  const verificarProcessosDisponiveis = useCallback(() => {
    if (!isInitialized) return;

    try {
      const disponiveis = processos.length;

      // Por enquanto, notificar sempre que há processos disponíveis
      // TODO: Implementar sistema de notificações baseado em processos não notificados
      if (disponiveis > 0) {
        const notificacao = {
          titulo: "Processos disponíveis",
          mensagem: `Você tem ${disponiveis} processo${disponiveis > 1 ? 's' : ''} disponível${disponiveis > 1 ? 'is' : ''} para aceitar`,
          tipo: NotificacaoTipo.INFO,
          link: "/processos/disponiveis"
        };

        // Adicionar notificação (por enquanto sempre, depois implementar controle)
        addNotification(notificacao);
      }

      setTotalDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao verificar processos disponíveis:", error);
      setTotalDisponiveis(0);
    }
  }, [processos, addNotification, isInitialized]);

  useEffect(() => {
    const carregarDados = async () => {
      await fetchProcessosDisponiveis();
      setIsInitialized(true);
    };
    carregarDados();
  }, [fetchProcessosDisponiveis]);

  useEffect(() => {
    verificarProcessosDisponiveis();
  }, [verificarProcessosDisponiveis]);

  return { totalDisponiveis };
}

export function HomeAdvogado() {
    const { totalDisponiveis } = useProcessosDisponiveisCount();

    return <DesktopView totalDisponiveis={totalDisponiveis} />;
}

function DesktopView({ totalDisponiveis }: { totalDisponiveis: number }) {
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
                        {/* Indicador de processos disponíveis */}
                        {totalDisponiveis > 0 && (
                            <div 
                                className="bg-dashboard-card-orange text-dashboard-orange px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => router.push("/processos/disponiveis")}
                            >
                                <AlertTriangle className="w-4 h-4 inline mr-1" />
                                {totalDisponiveis} processo{totalDisponiveis > 1 ? 's' : ''} disponível{totalDisponiveis > 1 ? 'is' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* KPIs principais */}
                <section className="grid grid-cols-3 gap-6 mb-8">
                    <Card 
                        className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 ${
                            totalDisponiveis > 0 
                                ? 'bg-gradient-dashboard-orange' 
                                : 'bg-gradient-dashboard-blue'
                        }`}
                        onClick={() => router.push(totalDisponiveis > 0 ? "/processos/disponiveis" : "/processos")}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium ${
                                        totalDisponiveis > 0 
                                            ? 'text-dashboard-card-orange-light' 
                                            : 'text-dashboard-card-blue-light'
                                    }`}>
                                        {totalDisponiveis > 0 ? 'Processos Disponíveis' : 'Casos Ativos'}
                                    </p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">
                                        {totalDisponiveis > 0 ? totalDisponiveis : '12'}
                                    </p>
                                    <p className={`text-xs ${
                                        totalDisponiveis > 0 
                                            ? 'text-dashboard-card-orange-light' 
                                            : 'text-dashboard-card-blue-light'
                                    }`}>
                                        {totalDisponiveis > 0 ? 'Aguardando atribuição' : '+2 este mês'}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${
                                    totalDisponiveis > 0 
                                        ? 'bg-white/20 dark:bg-orange-400/40' 
                                        : 'bg-white/20 dark:bg-blue-400/40'
                                }`}>
                                    {totalDisponiveis > 0 ? (
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
                            totalDisponiveis > 0 ? 'ring-2 ring-dashboard-orange' : ''
                        }`} 
                        onClick={() => router.push(totalDisponiveis > 0 ? "/processos/disponiveis" : "/processos")}
                    >
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            {totalDisponiveis > 0 && (
                                <div className="absolute -top-2 -right-2 bg-dashboard-orange text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                                    {totalDisponiveis > 9 ? '9+' : totalDisponiveis}
                                </div>
                            )}
                            <div className={`p-4 rounded-full mb-4 ${
                                totalDisponiveis > 0 
                                    ? 'bg-dashboard-orange-light' 
                                    : 'bg-dashboard-blue-light'
                            }`}>
                                {totalDisponiveis > 0 ? (
                                    <AlertTriangle className="w-8 h-8 text-dashboard-orange" />
                                ) : (
                                    <Briefcase className="w-8 h-8 text-dashboard-blue" />
                                )}
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Processos</h3>
                            <p className="text-sm text-muted-foreground">
                                {totalDisponiveis > 0 
                                    ? `${totalDisponiveis} disponível${totalDisponiveis > 1 ? 'is' : ''}` 
                                    : 'Gerenciar processos'
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
