import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Notificacao, NotificacaoState, NotificacaoTipo } from '@/types';

export const useNotificationStore = create<NotificacaoState>()(
  devtools(
    persist(
      (set) => ({
        notificacoes: [],
        naoLidas: 0,
        isLoading: false,
        error: null,
        
        addNotification: (notificacao: Omit<Notificacao, 'id' | 'dataHora' | 'lida'>) => set((state) => {
          const novaNotificacao: Notificacao = {
            ...notificacao,
            id: crypto.randomUUID(),
            dataHora: new Date().toISOString(),
            lida: false,
          };
          
          const notificacoes = [...state.notificacoes, novaNotificacao];
          
          return {
            notificacoes,
            naoLidas: notificacoes.filter(n => !n.lida).length
          };
        }),
        
        removeNotification: (id: string) => set((state) => {
          const notificacoes = state.notificacoes.filter((n) => n.id !== id);
          
          return {
            notificacoes,
            naoLidas: notificacoes.filter(n => !n.lida).length
          };
        }),
        
        markAsRead: (id: string) => set((state) => {
          const notificacoes = state.notificacoes.map((n) =>
            n.id === id ? { ...n, lida: true } : n
          );
          
          return {
            notificacoes,
            naoLidas: notificacoes.filter(n => !n.lida).length
          };
        }),
        
        markAllAsRead: () => set((state) => {
          const notificacoes = state.notificacoes.map((n) => ({ ...n, lida: true }));
          
          return {
            notificacoes,
            naoLidas: 0
          };
        }),
        
        clearAll: () => set({ 
          notificacoes: [],
          naoLidas: 0
        }),
        
        loadNotifications: async () => {
          set({ isLoading: true });
          try {
            // Aqui faria uma chamada à API para carregar notificações
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Dados simulados
            const notificacoes: Notificacao[] = [
              {
                id: '1',
                titulo: 'Novo caso atribuído',
                mensagem: 'Você foi atribuído ao caso #12345',
                tipo: NotificacaoTipo.INFO,
                dataHora: new Date().toISOString(),
                lida: false
              },
              {
                id: '2',
                titulo: 'Prazo se aproximando',
                mensagem: 'Você tem um prazo que vence amanhã',
                tipo: NotificacaoTipo.ALERTA,
                dataHora: new Date().toISOString(),
                lida: false
              }
            ];
            
            set({ 
              notificacoes, 
              naoLidas: notificacoes.filter(n => !n.lida).length,
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações',
              isLoading: false 
            });
          }
        }
      }),
      {
        name: 'notification-storage',
        partialize: (state) => ({ 
          notificacoes: state.notificacoes,
          naoLidas: state.naoLidas
        }),
      }
    )
  )
); 