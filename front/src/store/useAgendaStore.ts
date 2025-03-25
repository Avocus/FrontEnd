import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Evento, AgendaState, EventoTipo, EventoStatus } from '@/types';

export const useAgendaStore = create<AgendaState>()(
  devtools(
    persist(
      (set, get) => ({
        eventos: [],
        eventoSelecionado: null,
        isLoading: false,
        error: null,

        // Carregar eventos
        loadEventos: async () => {
          set({ isLoading: true });
          try {
            // Simulação de uma chamada API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const dataAtual = new Date();
            const amanha = new Date(dataAtual);
            amanha.setDate(dataAtual.getDate() + 1);
            
            // Simulando dados
            const eventos: Evento[] = [
              {
                id: '1',
                titulo: 'Audiência - Caso Silva',
                descricao: 'Audiência de conciliação',
                dataInicio: dataAtual.toISOString(),
                dataFim: new Date(dataAtual.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                tipo: EventoTipo.AUDIENCIA,
                processoId: '123',
                status: EventoStatus.PENDENTE,
                localizacao: 'Fórum Central'
              },
              {
                id: '2',
                titulo: 'Prazo - Entrega de documentos',
                descricao: 'Prazo para entrega de documentos do caso Oliveira',
                dataInicio: amanha.toISOString(),
                tipo: EventoTipo.PRAZO,
                processoId: '456',
                status: EventoStatus.PENDENTE
              }
            ];
            
            set({ eventos, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Erro ao carregar eventos',
              isLoading: false 
            });
          }
        },

        // Selecionar evento
        selectEvento: (id: string) => {
          const evento = get().eventos.find(e => e.id === id) || null;
          set({ eventoSelecionado: evento });
        },

        // Adicionar evento
        addEvento: async (evento: Omit<Evento, 'id'>) => {
          set({ isLoading: true });
          try {
            // Simulação de uma chamada API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const novoEvento: Evento = {
              ...evento,
              id: crypto.randomUUID()
            };
            
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
        updateEvento: async (id: string, eventoAtualizado: Partial<Evento>) => {
          set({ isLoading: true });
          try {
            // Simulação de uma chamada API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set(state => {
              const eventos = state.eventos.map(e => 
                e.id === id ? { ...e, ...eventoAtualizado } : e
              );
              
              const eventoSelecionado = state.eventoSelecionado?.id === id
                ? { ...state.eventoSelecionado, ...eventoAtualizado }
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
        removeEvento: async (id: string) => {
          set({ isLoading: true });
          try {
            // Simulação de uma chamada API
            await new Promise(resolve => setTimeout(resolve, 500));
            
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
        }
      }),
      {
        name: 'agenda-storage',
        partialize: (state) => ({
          eventos: state.eventos,
        }),
      }
    )
  )
); 