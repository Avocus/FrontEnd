"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, IdCard } from "lucide-react";
import { ClienteLista } from "@/types/entities/Cliente";

interface ModalDetalhesClientesProps {
  open: boolean;
  onClose: () => void;
  cliente: ClienteLista | null;
}

export function ModalDetalhesClientes({ open, onClose, cliente }: ModalDetalhesClientesProps) {
  if (!cliente) return null;

  const dataFormatada = new Date(cliente.dataNascimento).toLocaleDateString("pt-BR");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas do cliente selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">

          {/* Nome */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Nome</p>
            <p className="text-base font-semibold">{cliente.nome}</p>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email
            </p>
            <p>{cliente.email}</p>
          </div>

          {/* Telefone */}
          {cliente.telefone && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Phone className="h-4 w-4" /> Telefone
              </p>
              <p>{cliente.telefone}</p>
            </div>
          )}

          {/* CPF */}
          {cliente.cpf && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <IdCard className="h-4 w-4" /> CPF
              </p>
              <p>{cliente.cpf}</p>
            </div>
          )}

          {/* Status */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge className={`${cliente.ativo ? "bg-green-500" : "bg-red-500"} text-white`}>
              {cliente.ativo ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
            <p>{dataFormatada}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="border border-gray-300" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
