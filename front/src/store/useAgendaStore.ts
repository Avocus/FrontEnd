import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Evento, AgendaState, EventoTipo, EventoStatus, EventoCor, EventoFiltro } from '@/types';

export const useAgendaStore = create<AgendaState>()(
  devtools(
    persist(
      (set, get) => ({
        eventos: [],
        eventoSelecionado: null,
        isLoading: false,
        error: null,
        filtros: {},

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
                localizacao: 'Fórum Central',
                cor: EventoCor.AZUL,
                notificarPorEmail: true,
                lembrarAntes: 1440 // 24 horas antes
              },
              {
                id: '2',
                titulo: 'Prazo - Entrega de documentos',
                descricao: 'Prazo para entrega de documentos do caso Oliveira',
                dataInicio: amanha.toISOString(),
                tipo: EventoTipo.PRAZO,
                processoId: '456',
                status: EventoStatus.PENDENTE,
                cor: EventoCor.VERMELHO,
                notificarPorEmail: true,
                lembrarAntes: 1440
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
              id: crypto.randomUUID(),
              cor: evento.cor || EventoCor.AZUL,
              notificarPorEmail: evento.notificarPorEmail ?? true,
              lembrarAntes: evento.lembrarAntes ?? 1440
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

        // Definir filtros
        setFiltros: (filtros: Partial<EventoFiltro>) => {
          set(state => ({
            filtros: { ...state.filtros, ...filtros }
          }));
        },

        // Limpar filtros
        clearFiltros: () => {
          set({ filtros: {} });
        },

        // Marcar email como notificado
        marcarEmailNotificado: (eventoId: string) => {
          set(state => ({
            eventos: state.eventos.map(evento =>
              evento.id === eventoId
                ? { ...evento, emailNotificado: true }
                : evento
            )
          }));
        },

        // Obter eventos para notificar
        getEventosParaNotificar: () => {
          const { eventos } = get();
          const agora = new Date();
          const amanha = new Date();
          amanha.setDate(agora.getDate() + 1);
          
          return eventos.filter(evento => {
            if (!evento.notificarPorEmail || evento.emailNotificado) {
              return false;
            }
            
            const dataEvento = new Date(evento.dataInicio);
            const dataNotificacao = new Date(dataEvento);
            dataNotificacao.setMinutes(dataNotificacao.getMinutes() - (evento.lembrarAntes || 1440));
            
            return dataNotificacao <= agora && dataEvento > agora;
          });
        }
      }),
      {
        name: 'agenda-storage',
        partialize: (state) => ({
          eventos: state.eventos,
          filtros: state.filtros
        }),
      }
    )
  )
); 