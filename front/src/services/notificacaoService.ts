import api from '@/lib/api';
import { Notificacao, NotificacaoTipo } from '@/types';

export const notificacaoService = {
  async listar(): Promise<{ data: Notificacao[] }> {
    const response = await api.get<{ data: any[] }>('/notificacao');
    
    // Mapear os dados do backend para o formato do frontend
    const notificacoes: Notificacao[] = response.data.data.map((n: any) => ({
      id: n.id.toString(),
      titulo: n.titulo,
      mensagem: n.mensagem,
      tipo: n.tipo as NotificacaoTipo,
      dataHora: n.dataHora,
      lida: n.lida,
      link: n.link
    }));

    return { data: notificacoes };
  },

  async listarNaoLidas(): Promise<{ data: Notificacao[] }> {
    const response = await api.get<{ data: any[] }>('/notificacao/nao-lidas');
    
    const notificacoes: Notificacao[] = response.data.data.map((n: any) => ({
      id: n.id.toString(),
      titulo: n.titulo,
      mensagem: n.mensagem,
      tipo: n.tipo as NotificacaoTipo,
      dataHora: n.dataHora,
      lida: n.lida,
      link: n.link
    }));

    return { data: notificacoes };
  },

  async contarNaoLidas(): Promise<number> {
    const response = await api.get<{ data: number }>('/notificacao/contador-nao-lidas');
    return response.data.data;
  },

  async marcarComoLida(id: string): Promise<void> {
    await api.patch(`/notificacao/${id}/marcar-lida`);
  },

  async marcarTodasComoLidas(): Promise<void> {
    await api.patch('/notificacao/marcar-todas-lidas');
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/notificacao/${id}`);
  }
};