import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { ProcessoCliente } from "@/types/entities";

interface ModalProcessoPendenteProps {
  processo: ProcessoCliente | null;
  isOpen: boolean;
  onClose: () => void;
  onAceitar: (processo: ProcessoCliente) => void;
  onDeclinar: () => void;
}

export function ModalProcessoPendente({ processo, isOpen, onClose, onAceitar, onDeclinar }: ModalProcessoPendenteProps) {
  if (!processo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Novo Processo Pendente
          </DialogTitle>
          <DialogDescription>
            Um novo processo foi solicitado e está aguardando um advogado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Título do Processo</h4>
              <p className="text-sm text-muted-foreground">{processo.titulo}</p>
            </div>
            <div>
              <h4 className="font-medium">Cliente</h4>
              <p className="text-sm text-muted-foreground">{processo.cliente.nome}</p>
            </div>
            <div>
              <h4 className="font-medium">Tipo de Processo</h4>
              <p className="text-sm text-muted-foreground">{processo.tipoProcesso}</p>
            </div>
            <div>
              <h4 className="font-medium">Urgência</h4>
              <p className="text-sm text-muted-foreground capitalize">{processo.urgencia}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">{processo.descricao}</p>
          </div>

          <div>
            <h4 className="font-medium">Situação Atual</h4>
            <p className="text-sm text-muted-foreground">{processo.situacaoAtual}</p>
          </div>

          <div>
            <h4 className="font-medium">Objetivos</h4>
            <p className="text-sm text-muted-foreground">{processo.objetivos}</p>
          </div>

          {processo.documentosDisponiveis && (
            <div>
              <h4 className="font-medium">Documentos Disponíveis</h4>
              <p className="text-sm text-muted-foreground">{processo.documentosDisponiveis}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDeclinar} className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declinar
          </Button>
          <Button onClick={() => onAceitar(processo)} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Aceitar Processo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}