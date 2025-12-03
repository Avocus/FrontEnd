import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDadoRequisitadoStore } from '@/store/useDadoRequisitadoStore';
import { TipoDado, ResponsabilidadeDocumento } from '@/types/entities/DadoRequisitado';
import { FileText, Send } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface SolicitarDocumentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processoId: string;
  clienteId: number;
  onStatusChange?: () => void;
}

export function SolicitarDocumentoModal({
  open,
  onOpenChange,
  processoId,
  clienteId,
  onStatusChange,
}: SolicitarDocumentoModalProps) {
  const { criarSolicitacao, isLoading } = useDadoRequisitadoStore();
  const { success, error: showError } = useToast();

  type DocumentForm = {
    tipo: TipoDado;
    descricao: string;
    responsabilidade: ResponsabilidadeDocumento;
    prazoEntrega: string;
    observacoes: string;
  };

  const emptyDocument: DocumentForm = {
    tipo: TipoDado.DOCUMENTO,
    descricao: '',
    responsabilidade: ResponsabilidadeDocumento.CLIENTE,
    prazoEntrega: '',
    observacoes: '',
  };

  const [documents, setDocuments] = useState<DocumentForm[]>([emptyDocument]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<boolean[]>(() => [true]);

  useEffect(() => {
    setExpanded((prev) => {
      const next = prev.slice(0, documents.length);
      while (next.length < documents.length) next.push(true);
      return next;
    });
  }, [documents.length]);

  const lastOpenIndex = expanded.lastIndexOf(true);
  const canAddDocument = lastOpenIndex >= 0 && !!documents[lastOpenIndex]?.descricao?.trim();

  const handleAddDocument = () => {
    // somente adiciona se o último documento aberto tiver descrição preenchida
    const lastIdx = expanded.lastIndexOf(true);
    if (lastIdx === -1) return;
    if (!documents[lastIdx]?.descricao?.trim()) return;

    setDocuments((prev) => [...prev, { ...emptyDocument }]);
    setExpanded((prev) => {
      const next = prev.map(() => false);
      next.push(true);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.some((d) => !d.descricao.trim())) {
      showError('Por favor, descreva todos os documentos solicitados');
      return;
    }

    setIsSubmitting(true);
    try {
      const promises = documents.map((d) =>
        criarSolicitacao({
          processoId,
          clienteId,
          tipo: d.tipo,
          descricao: d.descricao,
          responsabilidade: d.responsabilidade,
          prazoEntrega: d.prazoEntrega || undefined,
          observacoes: d.observacoes || undefined,
        })
      );

      const results = await Promise.allSettled(promises);
      const successes = results.filter((r) => r.status === 'fulfilled').length;
      const failures = results.filter((r) => r.status === 'rejected').length;

      if (successes > 0 && failures === 0) {
        success(`${successes} solicitação(ões) enviada(s) ao cliente!`);
      } else if (successes > 0 && failures > 0) {
        success(`${successes} solicitação(ões) enviadas; ${failures} falharam.`);
      } else {
        showError('Erro ao enviar solicitações. Tente novamente.');
      }

      // Resetar formulário
      setDocuments([emptyDocument]);

      onStatusChange?.();
      onOpenChange(false);
    } catch (err) {
      showError('Erro ao enviar solicitações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDocuments([emptyDocument]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitar Documento ao Cliente
          </DialogTitle>
          <DialogDescription>
            Informe os detalhes do documento ou informação que precisa do cliente. Ele receberá uma notificação e poderá fazer o upload na aba de documentos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-[55vh] overflow-auto space-y-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="border rounded-md">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() =>
                    setExpanded((prev) => prev.map((v, i) => (i === idx ? !v : v)))
                  }
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium">Documento {idx + 1}</h3>
                    <p className="text-xs text-muted-foreground max-w-[40ch] truncate">{doc.descricao || 'Sem descrição'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {documents.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocuments((prev) => prev.filter((_, i) => i !== idx));
                          setExpanded((prev) => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        Remover
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">{expanded[idx] ? 'Ocultar' : 'Abrir'}</span>
                  </div>
                </div>

                <div className={expanded[idx] ? 'block p-4 space-y-4' : 'hidden'}>
                  <div className="space-y-2">
                    <Label htmlFor={`tipo-${idx}`}>Tipo de Dado *</Label>
                    <Select
                      value={doc.tipo}
                      onValueChange={(value) =>
                        setDocuments((prev) => prev.map((d, i) => (i === idx ? { ...d, tipo: value as TipoDado } : d)))
                      }
                    >
                      <SelectTrigger id={`tipo-${idx}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TipoDado.DOCUMENTO}>📄 Documento</SelectItem>
                        <SelectItem value={TipoDado.INFORMACAO}>ℹ️ Informação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`descricao-${idx}`}>Descrição do Documento *</Label>
                    <Textarea
                      id={`descricao-${idx}`}
                      placeholder="Ex: RG e CPF, Comprovante de residência atualizado, Contrato de trabalho..."
                      value={doc.descricao}
                      onChange={(e) =>
                        setDocuments((prev) => prev.map((d, i) => (i === idx ? { ...d, descricao: e.target.value } : d)))
                      }
                      rows={3}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Seja específico sobre o que precisa. O cliente verá esta descrição.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`responsabilidade-${idx}`}>Responsabilidade</Label>
                    <Select
                      value={doc.responsabilidade}
                      onValueChange={(value) =>
                        setDocuments((prev) => prev.map((d, i) => (i === idx ? { ...d, responsabilidade: value as ResponsabilidadeDocumento } : d)))
                      }
                    >
                      <SelectTrigger id={`responsabilidade-${idx}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ResponsabilidadeDocumento.CLIENTE}>Cliente deve fornecer</SelectItem>
                        <SelectItem value={ResponsabilidadeDocumento.ADVOGADO}>Advogado irá providenciar</SelectItem>
                        <SelectItem value={ResponsabilidadeDocumento.AMBOS}>Responsabilidade compartilhada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`prazoEntrega-${idx}`}>Prazo de Entrega (opcional)</Label>
                    <Input
                      id={`prazoEntrega-${idx}`}
                      type="date"
                      value={doc.prazoEntrega}
                      onChange={(e) =>
                        setDocuments((prev) => prev.map((d, i) => (i === idx ? { ...d, prazoEntrega: e.target.value } : d)))
                      }
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground">Define uma data limite para o cliente enviar o documento.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`observacoes-${idx}`}>Observações Adicionais (opcional)</Label>
                    <Textarea
                      id={`observacoes-${idx}`}
                      placeholder="Ex: Documento deve estar autenticado, precisa ser recente (últimos 3 meses)..."
                      value={doc.observacoes}
                      onChange={(e) =>
                        setDocuments((prev) => prev.map((d, i) => (i === idx ? { ...d, observacoes: e.target.value } : d)))
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddDocument}
              disabled={!canAddDocument || isLoading || isSubmitting}
            >
              Adicionar Documento
            </Button>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting || documents.some(d => !d.descricao.trim())} variant={"primary"}>
              {isLoading || isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
