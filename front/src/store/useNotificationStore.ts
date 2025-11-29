import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Notificacao, NotificacaoState, NotificacaoTipo } from '@/types';
import { connectNotifications, disconnectNotifications } from '@/services/notificationWebSocketService';
import { notificacaoService } from '@/services/notificacaoService';

export const useNotificationStore = create<NotificacaoState>()(
  devtools(
    persist(
      (set, get) => ({
        notificacoes: [],
        naoLidas: 0,
        isLoading: false,
        error: null,
        isWebSocketConnected: false,
        
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
        
        removeNotification: async (id: string) => {
          try {
            await notificacaoService.excluir(id);

            set((state) => {
              const notificacoes = state.notificacoes.filter((n) => n.id !== id);

              return {
                notificacoes,
                naoLidas: notificacoes.filter(n => !n.lida).length
              };
            });
          } catch (error) {
            console.error('Erro ao excluir notificação:', error);
          }
        },
        
        markAsRead: async (id: string) => {
          try {
            await notificacaoService.marcarComoLida(id);

            set((state) => {
              const notificacoes = state.notificacoes.map((n) =>
                n.id === id ? { ...n, lida: true } : n
              );

              return {
                notificacoes,
                naoLidas: notificacoes.filter(n => !n.lida).length
              };
            });
          } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
          }
        },
        
        markAllAsRead: async () => {
          try {
            await notificacaoService.marcarTodasComoLidas();

            set((state) => ({
              notificacoes: state.notificacoes.map((n) => ({ ...n, lida: true })),
              naoLidas: 0
            }));
          } catch (error) {
            console.error('Erro ao marcar todas as notificações como lidas:', error);
          }
        },
        
        clearAll: () => set({
          notificacoes: [],
          naoLidas: 0
        }),
        
        loadNotifications: async () => {
          set({ isLoading: true });
          try {
            const response = await notificacaoService.listar();
            const notificacoes = response.data;

            set({
              notificacoes,
              naoLidas: notificacoes.filter(n => !n.lida).length,
              isLoading: false
            });
          } catch (error) {
            console.error('Erro ao carregar notificações:', error);
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações',
              isLoading: false
            });
          }
        },

        connectWebSocket: (userId: string) => {
          if (get().isWebSocketConnected) return;

          connectNotifications(userId, (notification: any) => {
            const newNotification: Notificacao = {
              id: notification.id.toString(),
              titulo: notification.titulo,
              mensagem: notification.mensagem,
              tipo: notification.tipo as NotificacaoTipo,
              dataHora: notification.dataHora,
              lida: notification.lida,
              link: notification.link
            };

            set((state) => {
              const notificacoes = [newNotification, ...state.notificacoes];
              return {
                notificacoes,
                naoLidas: notificacoes.filter(n => !n.lida).length,
                isWebSocketConnected: true
              };
            });
          });

          set({ isWebSocketConnected: true });
        },

        disconnectWebSocket: () => {
          disconnectNotifications();
          set({ isWebSocketConnected: false });
        },
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
