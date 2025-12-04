import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DocumentoState, DocumentoProcesso, UploadDocumentoData } from '@/types/entities/Documento';
import { documentoService } from '@/services/documentoService';

export const useDocumentoStore = create<DocumentoState>()(
  devtools(
    (set, get) => ({
      documentos: [],
      documentosPorProcesso: {},
      isLoading: false,
      isUploading: false,
      uploadProgress: 0,
      error: null,

      loadDocumentos: async (processoId: string, clienteId?: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await documentoService.listar(processoId, clienteId);
          const documentos = response.data;

          set((state) => ({
            documentos,
            documentosPorProcesso: {
              ...state.documentosPorProcesso,
              [processoId]: documentos,
            },
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar documentos',
            isLoading: false,
          });
        }
      },

      uploadDocumento: async (file: File, data: UploadDocumentoData) => {
        set({ isUploading: true, uploadProgress: 0, error: null });
        try {
          const response = await documentoService.upload(file, data);
          const novoDocumento = response.data;

          set((state) => {
            const processoId = data.processoId;
            const documentosAtuais = state.documentosPorProcesso[processoId] || [];

            return {
              documentos: [...state.documentos, novoDocumento],
              documentosPorProcesso: {
                ...state.documentosPorProcesso,
                [processoId]: [...documentosAtuais, novoDocumento],
              },
              isUploading: false,
              uploadProgress: 100,
            };
          });

          // Recarregar documentos do processo
          await get().loadDocumentos(data.processoId);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao fazer upload',
            isUploading: false,
            uploadProgress: 0,
          });
          throw error;
        }
      },

      downloadDocumento: async (documentoId: string, nomeOriginal: string) => {
        try {
          const blob = await documentoService.download(documentoId);
          
          // Criar link temporário para download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = nomeOriginal;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao fazer download',
          });
          throw error;
        }
      },

      deleteDocumento: async (documentoId: string) => {
        try {
          await documentoService.deletar(documentoId);

          set((state) => {
            const documentos = state.documentos.filter((d) => d.id !== documentoId);
            const documentosPorProcesso = { ...state.documentosPorProcesso };

            // Remover de todos os processos
            Object.keys(documentosPorProcesso).forEach((processoId) => {
              documentosPorProcesso[processoId] = documentosPorProcesso[processoId].filter(
                (d) => d.id !== documentoId
              );
            });

            return {
              documentos,
              documentosPorProcesso,
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao excluir documento',
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    })
  )
);
