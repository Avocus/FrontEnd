import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Upload, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useDadoRequisitadoStore } from '@/store/useDadoRequisitadoStore';
import { DadoRequisitado, TipoDado, ResponsabilidadeDocumento } from '@/types/entities/DadoRequisitado';
import { UploadDocumentoButton } from './UploadDocumentoButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface DadosRequisitadosListProps {
  processoId: string;
  clienteId: number;
  isAdvogado?: boolean;
}

const TIPO_ICONS: Record<TipoDado, string> = {
  [TipoDado.DOCUMENTO]: '📄',
  [TipoDado.INFORMACAO]: 'ℹ️',
};

const TIPO_LABELS: Record<TipoDado, string> = {
  [TipoDado.DOCUMENTO]: 'Documento',
  [TipoDado.INFORMACAO]: 'Informação',
};

const RESPONSABILIDADE_LABELS: Record<ResponsabilidadeDocumento, string> = {
  [ResponsabilidadeDocumento.CLIENTE]: 'Cliente',
  [ResponsabilidadeDocumento.ADVOGADO]: 'Advogado',
  [ResponsabilidadeDocumento.AMBOS]: 'Ambos',
};

export function DadosRequisitadosList({
  processoId,
  clienteId,
  isAdvogado = false,
}: DadosRequisitadosListProps) {
  const { dadosPorProcesso, isLoading, loadDadosRequisitados } = useDadoRequisitadoStore();

  const [uploadingDadoId, setUploadingDadoId] = useState<string | null>(null);

  useEffect(() => {
    loadDadosRequisitados(processoId);
  }, [processoId, loadDadosRequisitados]);

  const dados = dadosPorProcesso[processoId] || [];
  
  // Se for cliente, filtrar apenas os não enviados (pendentes)
  const dadosFiltrados = isAdvogado ? dados : dados.filter((d) => !d.enviado);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };



  const handleUploadComplete = () => {
    setUploadingDadoId(null);
    loadDadosRequisitados(processoId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando solicitações...</span>
      </div>
    );
  }

  if (dadosFiltrados.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          {isAdvogado
            ? 'Nenhuma solicitação de documento enviada ainda.'
            : 'Você não tem documentos pendentes para este processo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">
          {isAdvogado ? 'Documentos Solicitados' : 'Documentos Pendentes'} ({dadosFiltrados.length})
        </h3>
      </div>

      <div className="space-y-3">
        {dadosFiltrados.map((dado) => {
          return (
            <div
              key={dado.id}
              className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-2xl mt-1">
                    {TIPO_ICONS[dado.tipo]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{dado.nomeDado}</h4>
                      <Badge variant="outline" className="text-xs">
                        {TIPO_LABELS[dado.tipo]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                      <span>Responsável: {RESPONSABILIDADE_LABELS[dado.responsavel]}</span>
                      <span>•</span>
                      <span>Solicitado em: {formatDate(dado.createdAt)}</span>
                    </div>

                    {dado.observacao && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        <strong>Obs:</strong> {dado.observacao}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {dado.enviado ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enviado
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendente
                    </Badge>
                  )}
                </div>
              </div>

              {/* Botão de Upload (só para cliente e se não enviado) */}
              {!isAdvogado && !dado.enviado && (
                <div className="pt-3 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setUploadingDadoId(String(dado.id))}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Documento
                  </Button>
                </div>
              )}

              {/* Informação do documento enviado */}
              {dado.enviado && dado.dataEnvio && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Enviado em {formatDate(dado.dataEnvio)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Upload */}
      <Dialog open={!!uploadingDadoId} onOpenChange={(open) => !open && setUploadingDadoId(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enviar Documento</DialogTitle>
            <DialogDescription>
              {uploadingDadoId && dadosFiltrados.find((d) => d.id === uploadingDadoId)?.nomeDado}
            </DialogDescription>
          </DialogHeader>

          <UploadDocumentoButton
            processoId={processoId}
            clienteId={clienteId}
            dadoRequisitadoId={uploadingDadoId ? String(uploadingDadoId) : undefined}
            enviadoPorAdvogado={false}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
