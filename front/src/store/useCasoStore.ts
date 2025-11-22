import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CasoCliente, CasoAdvogado } from '@/types/entities';
import { listarProcessos } from '@/services/processo/processoService';
import { StatusProcesso } from '@/types/enums';

interface CasoState {
  // Estado
  casosCliente: CasoCliente[];
  casosAdvogado: CasoAdvogado[];
  casosNotificados: Set<string>;

  // Ações para casos do cliente
  carregarCasosCliente: () => void;
  adicionarCasoCliente: (caso: CasoCliente) => void;
  atualizarCasoCliente: (id: string, updates: Partial<CasoCliente>) => void;
  removerCasoCliente: (id: string) => void;

  // Ações para casos do advogado
  carregarCasosAdvogado: () => void;
  adicionarCasoAdvogado: (caso: CasoAdvogado) => void;
  atualizarCasoAdvogado: (id: string, updates: Partial<CasoAdvogado>) => void;
  removerCasoAdvogado: (id: string) => void;

  // Ações para notificações
  marcarCasoComoNotificado: (id: string) => void;
  desmarcarCasoComoNotificado: (id: string) => void;
  limparNotificacoes: () => void;

  // Utilitários
  limparTodosDados: () => void;
}

export const useCasoStore = create<CasoState>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        casosCliente: [],
        casosAdvogado: [],
        casosNotificados: new Set(),

        // Ações para casos do cliente
        carregarCasosCliente: async () => {
          try {
            const processos = await listarProcessos();
            // Mapear ProcessoDTO para CasoCliente
            const casosCliente: CasoCliente[] = processos.map(processo => ({
              id: processo.id.toString(),
              clienteId: processo.cliente.id.toString(),
              clienteNome: processo.cliente.nome,
              titulo: processo.titulo,
              tipoProcesso: processo.tipoProcesso,
              descricao: processo.descricao,
              situacaoAtual: '', // Campo não existe no DTO
              objetivos: '', // Campo não existe no DTO
              urgencia: 'media' as const, // Valor padrão
              documentosDisponiveis: undefined,
              dataSolicitacao: processo.dataAbertura,
              status: processo.status,
              advogadoId: processo.advogado?.id?.toString(),
              advogadoNome: processo.advogado?.nome || '',
              documentosAnexados: [],
              timeline: processo.linhaDoTempo?.map(update => ({
                id: `timeline-${update.id}`,
                data: update.dataAtualizacao,
                statusAnterior: update.statusAnterior || undefined,
                novoStatus: update.novoStatus,
                descricao: update.descricao,
                autor: 'sistema' as const, // Valor padrão
                observacoes: undefined
              })) || []
            }));
            set({ casosCliente });
          } catch (error) {
            console.error('Erro ao carregar casos do cliente:', error);
            set({ casosCliente: [] });
          }
        },

        adicionarCasoCliente: (caso: CasoCliente) => {
          set((state) => ({
            casosCliente: [...state.casosCliente, caso]
          }));
        },

        atualizarCasoCliente: (id: string, updates: Partial<CasoCliente>) => {
          set((state) => ({
            casosCliente: state.casosCliente.map(caso =>
              caso.id === id ? { ...caso, ...updates } : caso
            )
          }));
        },

        removerCasoCliente: (id: string) => {
          set((state) => ({
            casosCliente: state.casosCliente.filter(caso => caso.id !== id)
          }));
        },

        // Ações para casos do advogado
        carregarCasosAdvogado: async () => {
          try {
            const processos = await listarProcessos();
            // Filtrar apenas processos que têm advogado atribuído
            const processosComAdvogado = processos.filter(processo => processo.advogado);
            // Mapear ProcessoDTO para CasoAdvogado
            const casosAdvogado: CasoAdvogado[] = processosComAdvogado.map(processo => ({
              id: processo.id.toString(),
              casoClienteId: processo.id.toString(), // Mesmo ID por enquanto
              advogadoId: processo.advogado!.id.toString(),
              advogadoNome: processo.advogado!.nome,
              clienteId: processo.cliente.id.toString(),
              clienteNome: processo.cliente.nome,
              titulo: processo.titulo,
              tipoProcesso: processo.tipoProcesso,
              descricao: processo.descricao,
              situacaoAtual: '', // Campo não existe no DTO
              objetivos: '', // Campo não existe no DTO
              urgencia: 'media' as const, // Valor padrão
              documentosDisponiveis: undefined,
              dataSolicitacao: processo.dataAbertura,
              dataAceite: processo.dataAbertura, // Usar dataAbertura como fallback
              status: processo.status,
              documentosAnexados: [],
              timeline: processo.linhaDoTempo?.map(update => ({
                id: `timeline-${update.id}`,
                data: update.dataAtualizacao,
                statusAnterior: update.statusAnterior || undefined,
                novoStatus: update.novoStatus,
                descricao: update.descricao,
                autor: 'sistema' as const, // Valor padrão
                observacoes: undefined
              })) || []
            }));
            set({ casosAdvogado });
          } catch (error) {
            console.error('Erro ao carregar casos do advogado:', error);
            set({ casosAdvogado: [] });
          }
        },

        adicionarCasoAdvogado: (caso: CasoAdvogado) => {
          set((state) => ({
            casosAdvogado: [...state.casosAdvogado, caso]
          }));
        },

        atualizarCasoAdvogado: (id: string, updates: Partial<CasoAdvogado>) => {
          set((state) => ({
            casosAdvogado: state.casosAdvogado.map(caso =>
              caso.id === id ? { ...caso, ...updates } : caso
            )
          }));
        },

        removerCasoAdvogado: (id: string) => {
          set((state) => ({
            casosAdvogado: state.casosAdvogado.filter(caso => caso.id !== id)
          }));
        },

        // Ações para notificações
        marcarCasoComoNotificado: (id: string) => {
          set((state) => ({
            casosNotificados: new Set([...state.casosNotificados, id])
          }));
        },

        desmarcarCasoComoNotificado: (id: string) => {
          set((state) => {
            const newSet = new Set(state.casosNotificados);
            newSet.delete(id);
            return { casosNotificados: newSet };
          });
        },

        limparNotificacoes: () => {
          set({ casosNotificados: new Set() });
        },

        // Utilitários
        limparTodosDados: () => {
          set({
            casosCliente: [],
            casosAdvogado: [],
            casosNotificados: new Set()
          });
        }
      }),
      {
        name: 'caso-store',
        partialize: (state) => ({
          casosCliente: state.casosCliente,
          casosAdvogado: state.casosAdvogado,
          casosNotificados: Array.from(state.casosNotificados)
        })
      }
    ),
    {
      name: 'caso-store-devtools'
    }
  )
);

// Selectors otimizados para performance
export const useCasosClientePendentes = () => 
  useCasoStore((state) => state.casosCliente.filter(caso => caso.status === StatusProcesso.PENDENTE));

export const useCasosAdvogadoAtivos = () => 
  useCasoStore((state) => state.casosAdvogado.filter(caso => 
    caso.status === StatusProcesso.ACEITO || caso.status === StatusProcesso.EM_ANDAMENTO || caso.status === StatusProcesso.AGUARDANDO_DOCUMENTOS
  ));

export const useTotalCasosCliente = () => 
  useCasoStore((state) => state.casosCliente.length);

export const useTotalCasosAdvogado = () => 
  useCasoStore((state) => state.casosAdvogado.length);

export const useCasosPorStatus = (status: CasoCliente['status']) => 
  useCasoStore((state) => state.casosCliente.filter(caso => caso.status === status));

export const useCasoClientePorId = (id: string) => 
  useCasoStore((state) => state.casosCliente.find(caso => caso.id === id));

export const useCasoAdvogadoPorId = (id: string) => 
  useCasoStore((state) => state.casosAdvogado.find(caso => caso.id === id));