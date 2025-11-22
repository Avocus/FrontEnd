import { createEvento, deleteEvento, getEventos, updateEvento } from '@/services/eventoService';
import { AgendaState, Evento, ValidatedUpdateEventoPayload } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAgendaStore = create<AgendaState>()(
  devtools(
    (set, get) => ({
        eventos: [],
        eventoSelecionado: null,
        isLoading: false,
        error: null,
        filtros: {},

        // Carregar eventos
        loadEventos: async () => {
          set({ isLoading: true, error: null });
          try {
            const eventos = await getEventos();
            set({ eventos, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar eventos',
              isLoading: false
            });
          }
        },

        // Selecionar evento
        selectEvento: (id: number) => {
          const evento = get().eventos.find(e => e.id === id) || null;
          set({ eventoSelecionado: evento });
        },

        // Adicionar evento
        addEvento: async (evento: ValidatedUpdateEventoPayload) => {
          set({ isLoading: true, error: null });
          try {

            const novoEvento = await createEvento(evento);

            set(state => ({
              eventos: [...state.eventos, novoEvento],
              isLoading: false
            }));

            return novoEvento;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao adicionar evento',
              isLoading: false
            });
            throw error;
          }
        },

        // Atualizar evento
        updateEvento: async (id: number, eventoAtualizado: Partial<Evento>) => {
          set({ isLoading: true, error: null });
          try {
            const payload = {
              titulo: eventoAtualizado.titulo,
              descricao: eventoAtualizado.descricao,
              tipo: eventoAtualizado.tipo,
              status: eventoAtualizado.status,
              cor: eventoAtualizado.cor,
              dataInicio: eventoAtualizado.dataInicio,
              dataFim: eventoAtualizado.dataFim,
              local: eventoAtualizado.local,
              diasLembrarAntes: eventoAtualizado.diasLembrarAntes,
              notificarPorEmail: eventoAtualizado.notificarPorEmail,
              clienteId: eventoAtualizado.cliente?.id,
              processoId: eventoAtualizado.processo?.id
            };

            const eventoAtualizadoResult = await updateEvento(id, payload);

            set(state => {
              const eventos = state.eventos.map(e =>
                e.id === id ? eventoAtualizadoResult : e
              );

              const eventoSelecionado = state.eventoSelecionado?.id === id
                ? eventoAtualizadoResult
                : state.eventoSelecionado;

              return { eventos, eventoSelecionado, isLoading: false };
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar evento',
              isLoading: false
            });
            throw error;
          }
        },

        // Remover evento
        removeEvento: async (id: number) => {
          set({ isLoading: true, error: null });
          try {
            await deleteEvento(id);

            set(state => {
              const eventos = state.eventos.filter(e => e.id !== id);
              const eventoSelecionado = state.eventoSelecionado?.id === id
                ? null
                : state.eventoSelecionado;

              return { eventos, eventoSelecionado, isLoading: false };
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover evento',
              isLoading: false
            });
            throw error;
          }
        },

        // Limpar seleção
        clearSelection: () => {
          set({ eventoSelecionado: null });
        },
        
        // Obter eventos por data
        getEventosByDate: (date: Date) => {
          const { eventos } = get();
          return eventos.filter(evento => {
            const eventoDate = new Date(evento.dataInicio);
            return (
              eventoDate.getDate() === date.getDate() &&
              eventoDate.getMonth() === date.getMonth() &&
              eventoDate.getFullYear() === date.getFullYear()
            );
          });
        },

        // Obter eventos próximos
        getEventosProximos: (dias = 7) => {
          const { eventos } = get();
          const agora = new Date();
          const limite = new Date();
          limite.setDate(agora.getDate() + dias);
          
          return eventos
            .filter(evento => {
              const dataEvento = new Date(evento.dataInicio);
              return dataEvento >= agora && dataEvento <= limite;
            })
            .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
        },

        // Obter eventos passados
        getEventosPassados: (dias = 7) => {
          const { eventos } = get();
          const agora = new Date();
          const limite = new Date();
          limite.setDate(agora.getDate() - dias);

          return eventos
            .filter(evento => {
              const dataEvento = new Date(evento.dataInicio);
              return dataEvento < agora && dataEvento >= limite;
            })
            .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
        },

        // Obter eventos que precisam de notificação
        getEventosParaNotificar: () => {
          const { eventos } = get();
          const agora = new Date();

          return eventos.filter(evento => {
            const dataEvento = new Date(evento.dataInicio);
            const diasAteEvento = Math.ceil((dataEvento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

            // Verificar se está dentro do período de lembrete e se deve notificar por email
            return diasAteEvento <= evento.diasLembrarAntes &&
                   diasAteEvento >= 0 &&
                   evento.notificarPorEmail &&
                   evento.status !== 'CONCLUIDO' &&
                   evento.status !== 'CANCELADO';
          });
        }
      })
    )
  ) 