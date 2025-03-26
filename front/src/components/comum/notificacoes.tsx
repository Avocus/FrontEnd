"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useNotificationStore } from "@/store";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Notificacao, NotificacaoTipo } from "@/types";

interface NotificacoesProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Função para obter cores baseadas no tipo de notificação
const getNotificationStyles = (tipo: NotificacaoTipo, lida: boolean) => {
    if (lida) return { bg: "bg-background", icon: null, color: "text-muted-foreground" };
    
    switch (tipo) {
        case NotificacaoTipo.SUCESSO:
            return { 
                bg: "bg-green-50", 
                icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                color: "text-green-700"
            };
        case NotificacaoTipo.ALERTA:
            return { 
                bg: "bg-amber-50", 
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
                color: "text-amber-700"
            };
        case NotificacaoTipo.ERRO:
            return { 
                bg: "bg-red-50", 
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                color: "text-red-700"
            };
        case NotificacaoTipo.INFO:
        default:
            return { 
                bg: "bg-blue-50", 
                icon: <Info className="h-5 w-5 text-blue-500" />,
                color: "text-blue-700"
            };
    }
};

export function Notificacoes({ open, onOpenChange }: NotificacoesProps) {
    const { 
        notificacoes,
        markAsRead,
        removeNotification,
        markAllAsRead,
        clearAll
    } = useNotificationStore();
    
    const showScrollbar = false;
    const scrollbarClass = showScrollbar ? "scrollbar-thin" : "scrollbar-hide";

    const unreadCount = notificacoes.filter(n => !n.lida).length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Modal de notificações sem o botão de fechar padrão */}
            <DialogContent className="sm:max-w-[480px] md:max-w-[520px] p-0 overflow-hidden" hideCloseButton>
                {/* Botão de fechar customizado */}
                <DialogClose className="absolute right-4 top-4 z-10 rounded-full h-6 w-6 flex items-center justify-center bg-muted/80 hover:bg-muted text-foreground transition-colors">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                </DialogClose>
                
                <div className="p-6">
                    <DialogHeader className="mt-6 flex flex-row items-center justify-between pb-4 border-b">
                        <DialogTitle className="text-lg font-semibold">
                            Notificações {unreadCount > 0 && `(${unreadCount})`}
                        </DialogTitle>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                className="h-9 px-3 text-xs"
                            >
                                <Check className="h-4 w-4 mr-1.5" />
                                Marcar todas como lidas
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={clearAll}
                                disabled={notificacoes.length === 0}
                                className="h-9 px-3 text-xs"
                            >
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                Limpar todas
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Lista de notificações */}
                    <div className={`space-y-4 max-h-[450px] overflow-y-auto mt-4 pr-3 ${scrollbarClass}`}>
                        {notificacoes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Nenhuma notificação encontrada
                            </div>
                        ) : (
                            notificacoes.map((notificacao: Notificacao) => {
                                const styles = getNotificationStyles(notificacao.tipo, notificacao.lida);
                                return (
                                    <div
                                        key={notificacao.id}
                                        className={`p-4 rounded-lg border ${styles.bg}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Ícone de status */}
                                            {!notificacao.lida && <div className="pt-1">{styles.icon}</div>}

                                            {/* Conteúdo da notificação */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className={`font-semibold text-sm truncate pr-3 ${!notificacao.lida ? styles.color : ''}`}>
                                                        {notificacao.titulo}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notificacao.dataHora), {
                                                            addSuffix: true,
                                                            locale: ptBR
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                                    {notificacao.mensagem}
                                                </p>
                                                
                                                <div className="flex justify-between mt-2">
                                                    {!notificacao.lida ? (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => markAsRead(notificacao.id)}
                                                            className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 mr-2"
                                                        >
                                                            Marcar como lida
                                                        </Button>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => removeNotification(notificacao.id)}
                                                        className="h-8 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2"
                                                    >
                                                        Remover
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
