import { useState } from 'react';
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

  const [formData, setFormData] = useState({
    tipo: TipoDado.DOCUMENTO,
    descricao: '',
    responsabilidade: ResponsabilidadeDocumento.CLIENTE,
    prazoEntrega: '',
    observacoes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao.trim()) {
      showError('Por favor, descreva o documento solicitado');
      return;
    }

    try {
      await criarSolicitacao({
        processoId,
        clienteId,
        tipo: formData.tipo,
        descricao: formData.descricao,
        responsabilidade: formData.responsabilidade,
        prazoEntrega: formData.prazoEntrega || undefined,
        observacoes: formData.observacoes || undefined,
      });

      success('Solicitação enviada ao cliente!');
      
      // Resetar formulário
      setFormData({
        tipo: TipoDado.DOCUMENTO,
        descricao: '',
        responsabilidade: ResponsabilidadeDocumento.CLIENTE,
        prazoEntrega: '',
        observacoes: '',
      });

      onStatusChange?.();
      onOpenChange(false);
    } catch (err) {
      showError('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setFormData({
      tipo: TipoDado.DOCUMENTO,
      descricao: '',
      responsabilidade: ResponsabilidadeDocumento.CLIENTE,
      prazoEntrega: '',
      observacoes: '',
    });
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
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Dado *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value as TipoDado })}
            >
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TipoDado.DOCUMENTO}>📄 Documento</SelectItem>
                <SelectItem value={TipoDado.INFORMACAO}>ℹ️ Informação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Documento *</Label>
            <Textarea
              id="descricao"
              placeholder="Ex: RG e CPF, Comprovante de residência atualizado, Contrato de trabalho..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Seja específico sobre o que precisa. O cliente verá esta descrição.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsabilidade">Responsabilidade</Label>
            <Select
              value={formData.responsabilidade}
              onValueChange={(value) => setFormData({ ...formData, responsabilidade: value as ResponsabilidadeDocumento })}
            >
              <SelectTrigger id="responsabilidade">
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
            <Label htmlFor="prazoEntrega">Prazo de Entrega (opcional)</Label>
            <Input
              id="prazoEntrega"
              type="date"
              value={formData.prazoEntrega}
              onChange={(e) => setFormData({ ...formData, prazoEntrega: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">
              Define uma data limite para o cliente enviar o documento.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Ex: Documento deve estar autenticado, precisa ser recente (últimos 3 meses)..."
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.descricao.trim()}>
              {isLoading ? (
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
