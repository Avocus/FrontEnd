import { useEffect } from 'react';
import { notificacaoService } from '@/services/notificacaoService';
import { useAgendaStore } from '@/store/useAgendaStore';

/**
 * Hook para inicializar e gerenciar o serviço de notificações
 */
export function useNotificacoes() {
  const { getEventosParaNotificar } = useAgendaStore();

  useEffect(() => {
    // Iniciar o serviço quando o componente montar
    notificacaoService.iniciarServico();

    // Cleanup ao desmontar
    return () => {
      notificacaoService.pararServico();
    };
  }, []);

  /**
   * Força uma verificação manual de notificações
   */
  const verificarNotificacoes = async () => {
    const eventosParaNotificar = getEventosParaNotificar();
    
    for (const evento of eventosParaNotificar) {
      // Aqui você deve obter o email do usuário logado do contexto de autenticação
      const emailUsuario = 'mateus.asfonseca@gmail.com'; // Placeholder
      
      const sucesso = await notificacaoService.enviarNotificacaoManual(evento, emailUsuario);
      
      if (sucesso) {
        console.log(`✅ Notificação enviada para: ${evento.titulo}`);
      } else {
        console.error(`❌ Falha ao enviar notificação para: ${evento.titulo}`);
      }
    }

    return eventosParaNotificar.length;
  };

  /**
   * Envia uma notificação manual para um evento específico
   */
  const enviarNotificacaoManual = async (eventoId: string, email: string) => {
    const { eventos } = useAgendaStore.getState();
    const evento = eventos.find(e => e.id === eventoId);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    return await notificacaoService.enviarNotificacaoManual(evento, email);
  };

  return {
    verificarNotificacoes,
    enviarNotificacaoManual,
  };
}
