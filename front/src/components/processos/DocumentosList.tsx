import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, Loader2 } from 'lucide-react';
import { useDocumentoStore } from '@/store/useDocumentoStore';
import { DocumentoProcesso } from '@/types/entities/Documento';

interface DocumentosListProps {
  processoId: string;
  clienteId?: number;
  isAdvogado?: boolean;
  onDelete?: (documentoId: string) => void;
  onStatusChange?: () => void;
}

export function DocumentosList({
  processoId,
  clienteId,
  isAdvogado = false,
  onDelete,
  onStatusChange,
}: DocumentosListProps) {
  const { documentosPorProcesso, isLoading, loadDocumentos, downloadDocumento, deleteDocumento } = useDocumentoStore();

  const documentos = documentosPorProcesso[processoId] || [];

  useEffect(() => {
    loadDocumentos(processoId, clienteId);
  }, [processoId, clienteId]);

  const handleDownload = async (documento: DocumentoProcesso) => {
    try {
      await downloadDocumento(documento.id, documento.nomeOriginal);
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
    }
  };

  const handleDelete = async (documentoId: string, nomeDocumento: string) => {
    if (!confirm(`Tem certeza que deseja excluir o documento "${nomeDocumento}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteDocumento(documentoId);
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando documentos...</span>
      </div>
    );
  }

  if (documentos.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          {isAdvogado
            ? 'Nenhum documento enviado ainda.'
            : 'Você ainda não enviou documentos para este processo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">
          Documentos ({documentos.length})
        </h3>
      </div>

      <div className="space-y-2">
        {documentos.map((documento) => (
          <div
            key={documento.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{documento.nomeOriginal}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span>{documento.tipoConteudo}</span>
                  <span>•</span>
                  <span>{formatFileSize(documento.tamanhoBytes)}</span>
                  <span>•</span>
                  <span>{formatDate(documento.createdAt)}</span>
                  {documento.enviadoPorAdvogado && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        Advogado
                      </Badge>
                    </>
                  )}
                  {!documento.enviadoPorAdvogado && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        Cliente
                      </Badge>
                    </>
                  )}
                </div>
                {documento.descricao && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {documento.descricao}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(documento)}
                className="h-9 px-3"
                title="Baixar documento"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="text-xs">Baixar</span>
              </Button>

              {isAdvogado && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(documento.id, documento.nomeOriginal)}
                  className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Excluir documento"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg border bg-muted/50">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            Total: {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
          </span>
          <span className="text-muted-foreground">
            ({formatFileSize(documentos.reduce((sum, doc) => sum + doc.tamanhoBytes, 0))})
          </span>
        </div>
      </div>
    </div>
  );
}
