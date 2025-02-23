"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock de notificações
const notifications = [
    {
        id: 1,
        title: "Novo processo cadastrado",
        message: "Você recebeu um novo caso sobre direito do consumidor.",
        link: "/processos/1",
        viewed: false,
    },
    {
        id: 2,
        title: "Prazo para envio de documentos",
        message: "O prazo para envio dos documentos do caso XYZ termina em 2 dias.",
        link: "/processos/2",
        viewed: true,
    },
    {
        id: 3,
        title: "Atualização no caso ABC",
        message: "Houve uma movimentação no caso ABC. Clique para ver detalhes.",
        link: "/processos/3",
        viewed: false,
    },
    {
        id: 4,
        title: "Feedback recebido",
        message: "Você recebeu um novo feedback do cliente João Silva.",
        link: "/feedback/4",
        viewed: true,
    },
];

interface NotificacoesProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

export function Notificacoes({ open, onOpenChange }: NotificacoesProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            {/* Modal de notificações */}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Notificações</DialogTitle>
                </DialogHeader>

                {/* Lista de notificações */}
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg ${
                                notification.viewed ? "bg-background" : "bg-secondary"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Ícone de status */}
                                {!notification.viewed && (
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                                )}

                                {/* Conteúdo da notificação */}
                                <div>
                                    <h3 className="font-semibold">{notification.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {notification.message}
                                    </p>
                                    <a
                                        href={notification.link}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Ver detalhes
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
