import { useEffect, useCallback } from 'react';
import { verificarNotificacoes, enviarNotificacaoManual } from '@/services/notificacaoService';
import { useAgendaStore } from '@/store/useAgendaStore';

/**
 * Hook para inicializar e gerenciar o serviço de notificações
 */
export function useNotificacoes() {
  const { getEventosParaNotificar } = useAgendaStore();

  const verificarNotificacoesCallback = useCallback(async () => {
    await verificarNotificacoes();
  }, []);

  useEffect(() => {
    // Verificar imediatamente na inicialização
    verificarNotificacoesCallback();

    // Verificar a cada hora se há eventos para notificar
    const intervalId = setInterval(() => {
      verificarNotificacoesCallback();
    }, 60 * 60 * 1000); // 1 hora

    // Cleanup ao desmontar
    return () => {
      clearInterval(intervalId);
    };
  }, [verificarNotificacoesCallback]);

  /**
   * Força uma verificação manual de notificações
   */
  const verificarNotificacoesManual = useCallback(async () => {
    await verificarNotificacoes();
    return getEventosParaNotificar().length;
  }, [getEventosParaNotificar]);

  /**
   * Envia uma notificação manual para um evento específico
   */
  const enviarNotificacaoManualHook = useCallback(async (eventoId: string, email: string) => {
    const { eventos } = useAgendaStore.getState();
    const evento = eventos.find(e => e.id === eventoId);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    return await enviarNotificacaoManual(evento, email);
  }, []);

  return {
    verificarNotificacoes: verificarNotificacoesManual,
    enviarNotificacaoManual: enviarNotificacaoManualHook,
  };
}
