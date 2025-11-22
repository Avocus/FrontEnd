import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { CasoCliente } from "@/types/entities";

interface ModalCasoPendenteProps {
  caso: CasoCliente | null;
  isOpen: boolean;
  onClose: () => void;
  onAceitar: (caso: CasoCliente) => void;
  onDeclinar: () => void;
}

export function ModalCasoPendente({ caso, isOpen, onClose, onAceitar, onDeclinar }: ModalCasoPendenteProps) {
  if (!caso) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Novo Caso Pendente
          </DialogTitle>
          <DialogDescription>
            Um novo caso foi solicitado e está aguardando um advogado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Título do Caso</h4>
              <p className="text-sm text-muted-foreground">{caso.titulo}</p>
            </div>
            <div>
              <h4 className="font-medium">Cliente</h4>
              <p className="text-sm text-muted-foreground">{caso.clienteNome}</p>
            </div>
            <div>
              <h4 className="font-medium">Tipo de Processo</h4>
              <p className="text-sm text-muted-foreground">{caso.tipoProcesso}</p>
            </div>
            <div>
              <h4 className="font-medium">Urgência</h4>
              <p className="text-sm text-muted-foreground capitalize">{caso.urgencia}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">{caso.descricao}</p>
          </div>

          <div>
            <h4 className="font-medium">Situação Atual</h4>
            <p className="text-sm text-muted-foreground">{caso.situacaoAtual}</p>
          </div>

          <div>
            <h4 className="font-medium">Objetivos</h4>
            <p className="text-sm text-muted-foreground">{caso.objetivos}</p>
          </div>

          {caso.documentosDisponiveis && (
            <div>
              <h4 className="font-medium">Documentos Disponíveis</h4>
              <p className="text-sm text-muted-foreground">{caso.documentosDisponiveis}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDeclinar} className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Declinar
          </Button>
          <Button onClick={() => onAceitar(caso)} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Aceitar Caso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}