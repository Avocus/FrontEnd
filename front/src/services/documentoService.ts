import api from '@/lib/api';
import { DocumentoProcesso, UploadDocumentoData } from '@/types/entities/Documento';

export const documentoService = {
  async upload(file: File, data: UploadDocumentoData): Promise<{ data: DocumentoProcesso }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Create a Blob with JSON content type for the dados part
    const dadosBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('dados', dadosBlob);

    const response = await api.post<{ data: DocumentoProcesso }>('/documento', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async listar(processoId: string, clienteId?: number): Promise<{ data: DocumentoProcesso[] }> {
    const params = clienteId ? { clienteId } : {};
    const response = await api.get<{ data: DocumentoProcesso[] }>(`/documento/processo/${processoId}`, { params });
    return response.data;
  },

  async download(documentoId: string): Promise<Blob> {
    const response = await api.get<Blob>(`/documento/${documentoId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deletar(documentoId: string): Promise<void> {
    await api.delete(`/documento/${documentoId}`);
  },
};
