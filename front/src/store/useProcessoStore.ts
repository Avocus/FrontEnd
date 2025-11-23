import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ProcessoCliente, ProcessoAdvogado } from '@/types/entities';
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
  removerProcessoCliente: (id: string) => void;

  // Ações para processos do advogado
  carregarProcessosAdvogado: () => void;
  buscarProcessoAdvogadoPorId: (id: string) => Promise<ProcessoAdvogado | null>;
  atualizarProcessoAdvogado: (id: string, updates: Partial<ProcessoAdvogado>) => void;
  removerProcessoAdvogado: (id: string) => void;

  // Ações para notificações
  marcarProcessoComoNotificado: (id: string) => void;
  desmarcarProcessoComoNotificado: (id: string) => void;
  limparNotificacoes: () => void;

  // Utilitários
  limparTodosDados: () => void;
}

export const useProcessoStore = create<ProcessoState>()(
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
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              urgencia: 'media',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined
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
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              urgencia: 'media',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined
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

        removerProcessoCliente: (id: string) => {
          set((state) => ({
            processosCliente: state.processosCliente.filter(processo => processo.id !== id)
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
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              urgencia: 'media',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined
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
              // Campos que existem no frontend mas não no backend
              objetivos: '',
              urgencia: 'media',
              documentosDisponiveis: undefined,
              documentosAnexados: [],
              motivoRejeicao: undefined
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

        removerProcessoAdvogado: (id: string) => {
          set((state) => ({
            processosAdvogado: state.processosAdvogado.filter(processo => processo.id !== id)
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

        // Utilitários
        limparTodosDados: () => {
          set({
            processosCliente: [],
            processosAdvogado: [],
            processosNotificados: new Set()
          });
        }
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
  useProcessoStore((state) => state.processosCliente.filter(processo => processo.status === StatusProcesso.PENDENTE));

export const useProcessosAdvogadoAtivos = () => 
  useProcessoStore((state) => state.processosAdvogado.filter(processo => 
    processo.status === StatusProcesso.ACEITO || processo.status === StatusProcesso.EM_ANDAMENTO || processo.status === StatusProcesso.AGUARDANDO_DADOS
  ));

export const useTotalProcessosCliente = () => 
  useProcessoStore((state) => state.processosCliente.length);

export const useTotalProcessosAdvogado = () => 
  useProcessoStore((state) => state.processosAdvogado.length);

export const useProcessosPorStatus = (status: ProcessoCliente['status']) => 
  useProcessoStore((state) => state.processosCliente.filter(processo => processo.status === status));

export const useProcessoClientePorId = (id: string) => 
  useProcessoStore((state) => state.processosCliente.find(processo => processo.id === id));

export const useProcessoAdvogadoPorId = (id: string) => 
  useProcessoStore((state) => state.processosAdvogado.find(processo => processo.id === id));