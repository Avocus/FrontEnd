import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNotificationStore, useProcessoStore } from "@/store";
import { getStatusProcessoLabel, NotificacaoTipo, StatusProcesso } from "@/types";
import { ProcessoCliente, ProcessoDTO, Evento } from "@/types/entities";
import { getEventosFuturos } from "@/services/eventoService";
import { listarProcessos } from "@/services/processo/processoService";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
    Briefcase, 
    // FileText, 
    AlertTriangle, 
    Calendar, 
    Users, 
    Timer,
    Activity
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

    const [eventos, setEventos] = useState<Evento[]>([]);
    const [processos, setProcessos] = useState<ProcessoDTO[]>([]);

    // Contagem de processos ativos (exclui os status listados)
    const activeCount = processos.filter(p => {
        const excluded = [
            StatusProcesso.RASCUNHO,
            StatusProcesso.PENDENTE,
            StatusProcesso.EM_ANALISE,
            StatusProcesso.REJEITADO,
            StatusProcesso.ARQUIVADO,
            StatusProcesso.CONCLUIDO,
        ];
        return !excluded.includes(p.status as StatusProcesso || p.status == undefined);
    }).length;

    useEffect(() => {
        let mounted = true;

        const carregarDados = async () => {
            try {
                const eventosResp = await getEventosFuturos();
                setEventos(eventosResp);
            } catch (err) {
                console.error('Erro ao carregar eventos:', err);
                setEventos([]);
            }

            try {
                const processosResp = await listarProcessos();
                if (!mounted) return;
                setProcessos(processosResp || []);
            } catch (err) {
                console.error('Erro ao carregar processos:', err);
                setProcessos([]);
            }
        };

        carregarDados();

        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header com boas-vindas */}
            <div className="bg-card border-b border px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Olá! Como posso ajudá-lo hoje?</h1>
                        <p className="text-muted-foreground">Acompanhe seus processos e mantenha-se informado</p>
                    </div>
                </div>
            </div>

            {/* Dashboard */}
            <div className="flex-1 p-8">
                {/* KPIs principais */}
                <section className="grid grid-cols-2 gap-6 mb-8">
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
                                        {totalDisponiveis > 0 ? totalDisponiveis : activeCount}
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

                    <Card className="bg-gradient-dashboard-orange border-0 shadow-lg hover:shadow-xl transition-shadowhover:cursor-pointer hover:-translate-y-1" onClick={() => router.push('/agenda')}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-orange-light text-sm font-medium">Meus Compromissos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">{eventos.length}</p>
                                </div>
                                <div className="bg-white/20 dark:bg-red-400/40 p-3 rounded-full">
                                    <Calendar className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
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
                                Meus Casos Recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                {processos.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Nenhum processo encontrado</div>
                                )}

                                {processos.slice(0, 3).map((p) => (
                                    <div key={p.id} className="flex items-center space-x-4 p-3 bg-dashboard-card-blue rounded-lg border-l-4 border-dashboard-blue">
                                        <div className="bg-dashboard-card-blue p-2 rounded-full">
                                            <Briefcase className="w-4 h-4 text-dashboard-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{p.titulo}</p>
                                            <p className="text-sm text-muted-foreground">{p.cliente?.nome || p.advogado?.nome || "-"}</p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">{getStatusProcessoLabel(p.status)}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximos Compromissos */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-red border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Timer className="w-5 h-5 mr-2 text-dashboard-red" />
                                Próximos Compromissos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                {eventos.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Nenhum compromisso encontrado</div>
                                )}

                                {eventos.slice(0, 3).map((e) => (
                                    <div key={e.id} className="flex items-center justify-between p-4 bg-dashboard-card-red/5 rounded-lg border">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-dashboard-card-red p-2 rounded-full">
                                                <Calendar className="w-4 h-4 text-dashboard-red" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{e.titulo}</p>
                                                <p className="text-sm text-muted-foreground">{e.processo?.titulo ?? e.descricao}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-dashboard-red">{new Date(e.dataInicio).toLocaleDateString('pt-BR')}</p>
                                            <p className="text-xs text-dashboard-red">{new Date(e.dataInicio).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <section className="grid grid-cols-3 gap-6">
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

                    {/* <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => router.push("/documentos")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-blue-light p-4 rounded-full mb-4">
                                <FileText className="w-8 h-8 text-dashboard-blue" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Documentos</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar documentos</p>
                        </CardContent>
                    </Card> */}

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
