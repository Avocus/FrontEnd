"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { getFieldValidationClass, getErrorMessage } from "@/utils/formValidation";
import { vincularCliente } from "@/services/advogado/advogadoService";
import { gerarLinkConvite } from "@/services/advogado/advogadoService";

const existingClientSchema = z.object({
  searchEmail: z.string().email("Email inválido"),
});

type ExistingClientForm = z.infer<typeof existingClientSchema>;

interface ModalAdicionarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteVinculado?: () => void;
}

export function ModalAdicionarCliente({ isOpen, onClose, onClienteVinculado }: ModalAdicionarClienteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [activeTab, setActiveTab] = useState("invite");
  const { success, error: showError } = useToast();

  const { register: registerExisting, handleSubmit: handleSubmitExisting, formState: { errors: errorsExisting, isValid: isValidExisting }, reset: resetExisting } = useForm<ExistingClientForm>({
    resolver: zodResolver(existingClientSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isOpen && activeTab === "invite" && !inviteUrl) {
      generateInvite(false);
    }
  }, [isOpen, activeTab, inviteUrl]);

  const generateInvite = async (showToast = true) => {
    setIsLoading(true);
    try {
      const inviteUrl = await gerarLinkConvite();
      setInviteUrl(inviteUrl);
      
      await navigator.clipboard.writeText(inviteUrl);
      
      if (showToast) {
        success("Link de convite gerado e copiado!");
      }
    } catch (err) {
      showError("Erro ao gerar convite. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteUrl = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      success("Link copiado!");
    }
  };

  const onSubmitExisting = async (data: ExistingClientForm) => {
    setIsLoading(true);
    try {
      await vincularCliente(data.searchEmail);
      success("Cliente vinculado com sucesso!");
      resetExisting(); // Limpa o formulário após sucesso
      onClienteVinculado?.(); // Chama callback para atualizar lista
      onClose();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, "Cliente não encontrado ou erro ao vincular.");
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInviteUrl("");
    resetExisting(); // Limpa o formulário de cliente existente
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Convide um novo cliente ou vincule um cliente existente à sua conta.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="invite" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Convidar Novo</TabsTrigger>
            <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invite" className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Link de Convite</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={inviteUrl}
                    readOnly
                    placeholder="O link será gerado automaticamente"
                    className="flex-1"
                  />
                  <Button onClick={copyInviteUrl} disabled={!inviteUrl} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" className="border border-gray-300" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="existing" className="space-y-4">
            <form onSubmit={handleSubmitExisting(onSubmitExisting)}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="searchEmail">Buscar Cliente por Email</Label>
                  <Input
                    id="searchEmail"
                    type="email"
                    placeholder="cliente@email.com"
                    {...registerExisting("searchEmail")}
                  />
                  {errorsExisting.searchEmail && (
                    <span className="text-sm text-red-500">{errorsExisting.searchEmail.message}</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Digite o email de um cliente já cadastrado para vinculá-lo à sua conta.
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" className="border border-gray-300" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="border border-gray-300" disabled={!isValidExisting || isLoading}>
                  {isLoading ? "Buscando..." : "Buscar e Vincular"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
