import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store";
import { NotificacaoTipo } from "@/types";
import { Bell } from "lucide-react";

export function NotificationButton() {
  const { addNotification } = useNotificationStore();
  
  const handleClick = () => {
    const notifications = [
      {
        titulo: "Novo processo cadastrado",
        mensagem: "Um novo caso de direito do consumidor foi atribuído a você. Clique para ver os detalhes.",
        tipo: NotificacaoTipo.INFO,
      },
      {
        titulo: "Prazo processual",
        mensagem: "O prazo para apresentação de recurso no processo 2023.0001.123456-7 termina em 5 dias.",
        tipo: NotificacaoTipo.ALERTA,
      },
      {
        titulo: "Audiência marcada",
        mensagem: "Você tem uma audiência de conciliação agendada para amanhã às 14:00 no caso Silva vs. Empresa XYZ.",
        tipo: NotificacaoTipo.INFO,
      },
      {
        titulo: "Documento enviado",
        mensagem: "A petição inicial do processo 2023.0002.654321-8 foi protocolada com sucesso.",
        tipo: NotificacaoTipo.SUCESSO,
      },
      {
        titulo: "Decisão judicial publicada",
        mensagem: "Foi publicada uma nova decisão no Diário Oficial referente ao processo 2023.0003.789456-9.",
        tipo: NotificacaoTipo.INFO,
      }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    addNotification({
      ...randomNotification,
      mensagem: randomNotification.mensagem + ` (Criado em ${new Date().toLocaleTimeString()})`,
    });
  };
  
  return (
    <Button 
      onClick={handleClick} 
      variant="outline"
      size="sm"
      className="gap-1 px-2"
    >
      <Bell className="h-4 w-4" />
      Testar Notificação
    </Button>
  );
} 