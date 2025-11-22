import { Evento } from '@/types';
import { useAgendaStore } from '@/store/useAgendaStore';

export const verificarNotificacoes = async (): Promise<void> => {
  try {
    // Buscar eventos da store
    const { eventos } = useAgendaStore.getState();

    const eventosParaNotificar = getEventosParaNotificar(eventos);

    for (const evento of eventosParaNotificar) {
      await enviarNotificacao(evento);
    }
  } catch (error) {
    console.error('Erro ao verificar notificações:', error);
  }
};

/**
 * Filtra eventos que precisam de notificação
 */
const getEventosParaNotificar = (eventos: Evento[]): Evento[] => {
  const agora = new Date();

  return eventos.filter(evento => {
    if (!evento.notificarPorEmail || evento.emailNotificado) {
      return false;
    }

    const dataEvento = new Date(evento.dataInicio);
    const minutosAntes = evento.lembrarAntes || 1440; // 24 horas por padrão
    const dataNotificacao = new Date(dataEvento);
    dataNotificacao.setMinutes(dataNotificacao.getMinutes() - minutosAntes);

    return dataNotificacao <= agora && dataEvento > agora;
  });
};

const enviarNotificacao = async (evento: Evento): Promise<void> => {
  try {
    const emailUsuario = 'mateus.asfonseca@gmail.com'; // TODO - ajustar

    const response = await fetch('/api/agenda/notificacao-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        para: emailUsuario,
        titulo: evento.titulo,
        dataEvento: evento.dataInicio,
        descricao: evento.descricao,
        localizacao: evento.localizacao,
      }),
    });

    if (response.ok) {
      // Marcar como notificado na store
      marcarComoNotificado(evento.id);
      console.log(`✅ Notificação enviada para evento: ${evento.titulo}`);
    } else {
      const errorData = await response.json();
      console.error(`❌ Erro ao enviar notificação para evento: ${evento.titulo}`, errorData);
    }
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
};

const marcarComoNotificado = (eventoId: string): void => {
  try {
    useAgendaStore.getState().marcarEmailNotificado(eventoId);
  } catch (error) {
    console.error('Erro ao marcar evento como notificado:', error);
  }
};

export const enviarNotificacaoManual = async (evento: Evento, email: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/agenda/notificacao-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        para: email,
        titulo: evento.titulo,
        dataEvento: evento.dataInicio,
        descricao: evento.descricao,
        localizacao: evento.localizacao,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar notificação manual:', error);
    return false;
  }
};