import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ProcessoCliente, ProcessoAdvogado, TimelineEntry } from '@/types/entities';
import { listarProcessos, buscarProcessoPorId } from '@/services/processo/processoService';
import { StatusProcesso } from '@/types/enums';

interface ProcessoState {
  // Estado
  processosCliente: ProcessoCliente[];
  processosAdvogado: ProcessoAdvogado[];
  processosNotificados: Set<string>;

  // Ações para processos do cliente
  carregarProcessosCliente: () => void;
  buscarProcessoClientePorId: (id: string) => Promise<ProcessoCliente | null>;
  atualizarProcessoCliente: (id: string, updates: Partial<ProcessoCliente>) => void;

  // Ações para processos do advogado
  carregarProcessosAdvogado: () => void;
  buscarProcessoAdvogadoPorId: (id: string) => Promise<ProcessoAdvogado | null>;
  atualizarProcessoAdvogado: (id: string, updates: Partial<ProcessoAdvogado>) => void;

  // Ações para notificações
  marcarProcessoComoNotificado: (id: string) => void;
  desmarcarProcessoComoNotificado: (id: string) => void;
  limparNotificacoes: () => void;

}

const useProcessoStoreBase = create<ProcessoState>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        processosCliente: [],
        processosAdvogado: [],
        processosNotificados: new Set(),

        // Ações para processos do cliente
        carregarProcessosCliente: async () => {
          try {
            const processos = await listarProcessos();
            // Mapear ProcessoDTO para ProcessoCliente
            const processosCliente: ProcessoCliente[] = processos.map(processo => ({
              ...processo,
              id: processo.id.toString(),
              situacaoAtual: processo.status,
              dataSolicitacao: processo.dataAbertura,
              urgencia: processo.urgencia,
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined,
              timeline: [],
              eventos: []
            }));
            set({ processosCliente });
          } catch (error) {
            console.error('Erro ao carregar processos do cliente:', error);
            set({ processosCliente: [] });
          }
        },

        buscarProcessoClientePorId: async (id: string) => {
          try {
            const processo = await buscarProcessoPorId(id);

            // Mapeamento usando destructuring para campos compatíveis
            const processoCliente: ProcessoCliente = {
              ...processo,
              id: processo.id.toString(),
              situacaoAtual: processo.status,
              dataSolicitacao: processo.dataAbertura,
              urgencia: processo.urgencia,
              // Mapear linhaDoTempo para timeline
              timeline: processo.linhaDoTempo ? processo.linhaDoTempo.map(update => ({
                id: update.id.toString(),
                data: update.dataAtualizacao,
                statusAnterior: update.statusAnterior,
                novoStatus: update.novoStatus,
                descricao: update.descricao,
                autor: "sistema" as const, // Por enquanto, definir como sistema
                observacoes: undefined
              })) : [],
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined,
              eventos: []
            };

            // Adicionar à store
            set((state) => ({
              processosCliente: [...state.processosCliente.filter(c => c.id !== id), processoCliente]
            }));

            return processoCliente;
          } catch (error) {
            console.error('Erro ao buscar processo do cliente:', error);
            return null;
          }
        },

        atualizarProcessoCliente: (id: string, updates: Partial<ProcessoCliente>) => {
          set((state) => ({
            processosCliente: state.processosCliente.map(processo =>
              processo.id === id ? { ...processo, ...updates } : processo
            )
          }));
        },


        // Ações para processos do advogado
        carregarProcessosAdvogado: async () => {
          try {
            const processos = await listarProcessos();
            // Filtrar apenas processos que têm advogado atribuído
            const processosComAdvogado = processos.filter(processo => processo.advogado);
            // Mapear ProcessoDTO para ProcessoAdvogado
            const processosAdvogado: ProcessoAdvogado[] = processosComAdvogado.map(processo => ({
              ...processo,
              id: processo.id.toString(),
              situacaoAtual: processo.status,
              dataSolicitacao: processo.dataAbertura,
              dataAceite: processo.dataAbertura,
              advogado: processo.advogado!,
              urgencia: processo.urgencia,
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined,
              timeline: [],
              eventos: []
            }));
            set({ processosAdvogado });
          } catch (error) {
            console.error('Erro ao carregar processos do advogado:', error);
            set({ processosAdvogado: [] });
          }
        },

        buscarProcessoAdvogadoPorId: async (id: string) => {
          try {
            const processo = await buscarProcessoPorId(id);

            // Verificar se o processo tem advogado
            if (!processo.advogado) {
              return null;
            }

            // Mapeamento usando destructuring para campos compatíveis
            const processoAdvogado: ProcessoAdvogado = {
              ...processo,
              id: processo.id.toString(),
              situacaoAtual: processo.status,
              dataSolicitacao: processo.dataAbertura,
              dataAceite: processo.dataAbertura,
              advogado: processo.advogado,
              urgencia: processo.urgencia,
              // Mapear linhaDoTempo para timeline
              timeline: processo.linhaDoTempo ? processo.linhaDoTempo.map(update => ({
                id: update.id.toString(),
                data: update.dataAtualizacao,
                statusAnterior: update.statusAnterior,
                novoStatus: update.novoStatus,
                descricao: update.descricao,
                autor: "sistema" as const, // Por enquanto, definir como sistema
                observacoes: undefined
              })) : [],
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined,
              eventos: []
            };

            // Adicionar à store
            set((state) => ({
              processosAdvogado: [...state.processosAdvogado.filter(c => c.id !== id), processoAdvogado]
            }));

            return processoAdvogado;
          } catch (error) {
            console.error('Erro ao buscar processo do advogado:', error);
            return null;
          }
        },

        atualizarProcessoAdvogado: (id: string, updates: Partial<ProcessoAdvogado>) => {
          set((state) => ({
            processosAdvogado: state.processosAdvogado.map(processo =>
              processo.id === id ? { ...processo, ...updates } : processo
            )
          }));
        },

        // Ações para notificações
        marcarProcessoComoNotificado: (id: string) => {
          set((state) => ({
            processosNotificados: new Set([...state.processosNotificados, id])
          }));
        },

        desmarcarProcessoComoNotificado: (id: string) => {
          set((state) => {
            const newSet = new Set(state.processosNotificados);
            newSet.delete(id);
            return { processosNotificados: newSet };
          });
        },

        limparNotificacoes: () => {
          set({ processosNotificados: new Set() });
        },

      }),
      {
        name: 'processo-store',
        partialize: (state) => ({
          processosCliente: state.processosCliente,
          processosAdvogado: state.processosAdvogado,
          processosNotificados: Array.from(state.processosNotificados)
        })
      }
    ),
    {
      name: 'processo-store-devtools'
    }
  )
);

// Selectors otimizados para performance
export const useProcessosClientePendentes = () => 
  useProcessoStoreBase((state) => state.processosCliente.filter(processo => processo.status === StatusProcesso.PENDENTE));

export const useProcessosAdvogadoAtivos = () => 
  useProcessoStoreBase((state) => state.processosAdvogado.filter(processo => 
    processo.status === StatusProcesso.ACEITO || processo.status === StatusProcesso.EM_ANDAMENTO || processo.status === StatusProcesso.AGUARDANDO_DADOS
  ));

export const useTotalProcessosCliente = () => 
  useProcessoStoreBase((state) => state.processosCliente.length);

export const useTotalProcessosAdvogado = () => 
  useProcessoStoreBase((state) => state.processosAdvogado.length);

export const useProcessosPorStatus = (status: ProcessoCliente['status']) => 
  useProcessoStoreBase((state) => state.processosCliente.filter(processo => processo.status === status));

export const useProcessoClientePorId = (id: string) => 
  useProcessoStoreBase((state) => state.processosCliente.find(processo => processo.id === id));

export const useProcessoAdvogadoPorId = (id: string) => 
  useProcessoStoreBase((state) => state.processosAdvogado.find(processo => processo.id === id));

// Export the main store
export const useProcessoStore = useProcessoStoreBase;