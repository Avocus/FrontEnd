import { Evento } from '@/types';

export class NotificacaoService {
  private static instance: NotificacaoService;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): NotificacaoService {
    if (!NotificacaoService.instance) {
      NotificacaoService.instance = new NotificacaoService();
    }
    return NotificacaoService.instance;
  }

  /**
   * Inicia o serviço de notificações automáticas
   */
  public iniciarServico(): void {
    if (this.intervalId) {
      return; // Já está rodando
    }

    // Verificar a cada hora se há eventos para notificar
    this.intervalId = setInterval(() => {
      this.verificarNotificacoes();
    }, 60 * 60 * 1000); // 1 hora

    // Verificar imediatamente na inicialização
    this.verificarNotificacoes();
  }

  /**
   * Para o serviço de notificações
   */
  public pararServico(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Verifica se há eventos que precisam ser notificados
   */
  private async verificarNotificacoes(): Promise<void> {
    try {
      // Buscar eventos do localStorage (ou você pode integrar com o store)
      const stored = localStorage.getItem('agenda-storage');
      if (!stored) return;

      const { state } = JSON.parse(stored);
      const eventos: Evento[] = state?.eventos || [];

      const eventosParaNotificar = this.getEventosParaNotificar(eventos);

      for (const evento of eventosParaNotificar) {
        await this.enviarNotificacao(evento);
      }
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  }

  /**
   * Filtra eventos que precisam de notificação
   */
  private getEventosParaNotificar(eventos: Evento[]): Evento[] {
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
  }

  /**
   * Envia notificação por e-mail
   */
  private async enviarNotificacao(evento: Evento): Promise<void> {
    try {
      // Aqui você obteria o e-mail do usuário logado
      // Por enquanto, vamos usar um e-mail fictício
      const emailUsuario = 'mateus.asfonseca@gmail.com'; // Deve vir do contexto de autenticação

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
        // Marcar como notificado no store
        this.marcarComoNotificado(evento.id);
        console.log(`✅ Notificação enviada para evento: ${evento.titulo}`);
      } else {
        const errorData = await response.json();
        console.error(`❌ Erro ao enviar notificação para evento: ${evento.titulo}`, errorData);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Marca um evento como notificado no localStorage
   */
  private marcarComoNotificado(eventoId: string): void {
    try {
      const stored = localStorage.getItem('agenda-storage');
      if (!stored) return;

      const data = JSON.parse(stored);
      if (data.state?.eventos) {
        data.state.eventos = data.state.eventos.map((evento: Evento) =>
          evento.id === eventoId
            ? { ...evento, emailNotificado: true }
            : evento
        );

        localStorage.setItem('agenda-storage', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro ao marcar evento como notificado:', error);
    }
  }

  /**
   * Envia notificação manual para um evento específico
   */
  public async enviarNotificacaoManual(evento: Evento, email: string): Promise<boolean> {
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
  }
}

// Instância singleton para uso global
export const notificacaoService = NotificacaoService.getInstance();
