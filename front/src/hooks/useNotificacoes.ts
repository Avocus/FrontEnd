import { useEffect, useCallback } from 'react';
import { useAgendaStore } from '@/store/useAgendaStore';

/**
 * Hook para inicializar e gerenciar o serviço de notificações de agenda
 * Note: Este hook é específico para notificações de eventos da agenda
 */
export function useNotificacoes() {
  const { getEventosParaNotificar } = useAgendaStore();

  const verificarNotificacoesCallback = useCallback(async () => {
    // Verificar eventos que precisam de notificação
    const eventosParaNotificar = getEventosParaNotificar();
    console.log('Eventos para notificar:', eventosParaNotificar.length);
  }, [getEventosParaNotificar]);

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
    const eventos = getEventosParaNotificar();
    console.log('Verificação manual - eventos para notificar:', eventos.length);
    return eventos.length;
  }, [getEventosParaNotificar]);

  return {
    verificarNotificacoes: verificarNotificacoesManual,
  };
}
