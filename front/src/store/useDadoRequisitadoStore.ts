import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DadoRequisitadoState, DadoRequisitado, CriarDadoRequisitadoData } from '@/types/entities/DadoRequisitado';
import { dadoRequisitadoService } from '@/services/dadoRequisitadoService';

export const useDadoRequisitadoStore = create<DadoRequisitadoState>()(
  devtools(
    (set, get) => ({
      dadosRequisitados: [],
      dadosPorProcesso: {},
      isLoading: false,
      error: null,

      loadDadosRequisitados: async (processoId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await dadoRequisitadoService.listar(processoId);
          const dados = response.data;

          set((state) => ({
            dadosRequisitados: dados,
            dadosPorProcesso: {
              ...state.dadosPorProcesso,
              [processoId]: dados,
            },
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar solicitações',
            isLoading: false,
          });
        }
      },

      criarSolicitacao: async (data: CriarDadoRequisitadoData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await dadoRequisitadoService.criar(data);
          const novaSolicitacao = response.data;

          set((state) => {
            const processoId = data.processoId;
            const dadosAtuais = state.dadosPorProcesso[processoId] || [];

            return {
              dadosRequisitados: [...state.dadosRequisitados, novaSolicitacao],
              dadosPorProcesso: {
                ...state.dadosPorProcesso,
                [processoId]: [...dadosAtuais, novaSolicitacao],
              },
              isLoading: false,
            };
          });

          // Recarregar dados do processo
          await get().loadDadosRequisitados(data.processoId);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao criar solicitação',
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    })
  )
);
