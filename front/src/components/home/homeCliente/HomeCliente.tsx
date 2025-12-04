"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Calendar, 
    Book, 
    Briefcase, 
    FileText, 
    Plus,
    // Download,
    Timer
} from "lucide-react";
import { getEventosFuturos } from "@/services/eventoService";
import { listarProcessos } from "@/services/processo/processoService";
import { Evento, ProcessoDTO } from "@/types/entities";
import { getStatusProcessoLabel, StatusProcesso } from "@/types";
import { getNumeroDocumentosPendentes } from "@/services/cliente/clienteService";
import { se } from "date-fns/locale";

export function HomeCliente() {

    return <DesktopView />
}

function DesktopView() {
    const router = useRouter();

    const [eventos, setEventos] = useState<Evento[]>([]);
    const [processos, setProcessos] = useState<ProcessoDTO[]>([]);
    const [documentosPendentes, setDocumentosPendentes] = useState<number>(0);
    
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
        return !excluded.includes(p.status as StatusProcesso);
    }).length;

    useEffect(() => {
        let mounted = true;

        const carregar = async () => {
            try {
                const eventosResp = await getEventosFuturos();
                setEventos(eventosResp);
            } catch (err) {
                console.error('Erro ao carregar eventos:', err);
                setEventos([]);
            }

            try {
                const ps = await listarProcessos();
                if (!mounted) return;
                setProcessos(ps || []);
            } catch (err) {
                console.error('Erro carregando processos:', err);
                setProcessos([]);
            }

            try {
                const documentosPendentesResp = await getNumeroDocumentosPendentes();
                if (!mounted) return;
                setDocumentosPendentes(documentosPendentesResp);
            } catch (error) {
                setDocumentosPendentes(0);
                console.error('Erro ao carregar documentos pendentes:', error);
            }
        };

        carregar();
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
                <section className="grid grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-dashboard-blue border-0 shadow-lg hover:shadow-xl transition-shadow  hover:cursor-pointer hover:-translate-y-1" onClick={() => router.push('/processos')}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-blue-light text-sm font-medium">Processos Ativos</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">{activeCount}</p>
                                    <p className="text-dashboard-card-blue-light text-xs">{activeCount} ativos</p>
                                </div>
                                <div className="bg-white/20 dark:bg-blue-400/40 p-3 rounded-full">
                                    <Briefcase className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-dashboard-orange border-0 shadow-lg hover:shadow-xl transition-shadow hover:cursor-pointer hover:-translate-y-1" onClick={() => router.push('/agenda')}>
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

                    <Card className="bg-gradient-dashboard-yellow border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-card-yellow-light text-sm font-medium">Documentos Pendentes</p>
                                    <p className="text-3xl font-bold text-dashboard-card-primary">{documentosPendentes}</p>
                                    <p className="text-dashboard-card-yellow-light text-xs">Para enviar</p>
                                </div>
                                <div className="bg-white/20 dark:bg-orange-400/40 p-3 rounded-full">
                                    <FileText className="w-6 h-6 text-white dark:text-dashboard-card-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Seção principal com processos e compromissos */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Meus Casos Recentes */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-dashboard-card-blue border-b">
                            <CardTitle className="flex items-center text-foreground">
                                <Briefcase className="w-5 h-5 mr-2 text-dashboard-blue" />
                                Meus Casos Recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-4 p-6">
                                {processos.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Nenhum processo encontrado</div>
                                )}

                                {processos.slice(0, 3).map((p) => (
                                    <div key={p.id} className="flex items-center space-x-4 p-4 bg-dashboard-card-blue rounded-lg border-l-4 border-dashboard-blue">
                                        <div className="bg-dashboard-card-blue p-2 rounded-full">
                                            <Briefcase className="w-4 h-4 text-dashboard-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{p.titulo}</p>
                                            <p className="text-sm text-muted-foreground">{p.advogado?.nome || p.cliente?.nome || ''}</p>
                                        </div>
                                        <span className="text-muted-foreground text-sm font-medium bg-dashboard-card-blue px-2 py-1 rounded">{getStatusProcessoLabel(p.status)}</span>
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
                            <h3 className="font-semibold mb-2 text-foreground">Ver Agenda</h3>
                            <p className="text-sm text-muted-foreground">Ver próximos eventos</p>
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

                    {/* <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-0 shadow-md" onClick={() => window.location.href = "/conta"}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="bg-dashboard-orange-light p-4 rounded-full mb-4">
                                <Download className="w-8 h-8 text-dashboard-orange" />
                            </div>
                            <h3 className="font-semibold mb-2 text-foreground">Meus Documentos</h3>
                            <p className="text-sm text-muted-foreground">Gerenciar documentos pessoais</p>
                        </CardContent>
                    </Card> */}
                </section>
            </div>
        </div>
    );
}
