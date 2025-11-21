import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CasoCliente, CasoAdvogado } from '@/types/entities';

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
        carregarCasosCliente: () => {
          // Agora só usa a store - sem fallback para localStorage
          set({ casosCliente: [] });
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
        carregarCasosAdvogado: () => {
          // Agora só usa a store - sem fallback para localStorage
          set({ casosAdvogado: [] });
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
  useCasoStore((state) => state.casosCliente.filter(caso => caso.status === 'pendente'));

export const useCasosAdvogadoAtivos = () => 
  useCasoStore((state) => state.casosAdvogado.filter(caso => 
    caso.status === 'aceito' || caso.status === 'em_andamento' || caso.status === 'esperando_documentos'
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