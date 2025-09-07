"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFieldValidationClass } from "@/utils/formValidation";

const adicionarClienteSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

const existingClientSchema = z.object({
  searchEmail: z.string().email("Email inválido"),
});

type AdicionarClienteForm = z.infer<typeof adicionarClienteSchema>;
type ExistingClientForm = z.infer<typeof existingClientSchema>;

interface ModalAdicionarClienteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalAdicionarCliente({ isOpen, onClose }: ModalAdicionarClienteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const { register: registerExisting, handleSubmit: handleSubmitExisting, formState: { errors: errorsExisting, isValid: isValidExisting } } = useForm<ExistingClientForm>({
    resolver: zodResolver(existingClientSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: AdicionarClienteForm) => {
    setIsLoading(true);
    try {
      // Gerar link de convite com parâmetro do advogado
      const inviteToken = btoa(JSON.stringify({
        email: data.email,
        type: 'cliente',
        invitedBy: 'advogado-id', // TODO: pegar do contexto/auth
        timestamp: Date.now()
      }));
      
      const inviteUrl = `${window.location.origin}/cadastro?invite=${inviteToken}`;
      
      // TODO: Salvar convite no backend
      console.log("Convite gerado:", inviteUrl);
      
      // Copiar para clipboard ou enviar por email
      await navigator.clipboard.writeText(inviteUrl);
      
      success("Link de convite copiado! Cole e envie para o cliente.");
      reset();
      onClose();
    } catch (err) {
      showError("Erro ao gerar convite. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, dirtyFields },
    reset,
    watch,
  } = useForm<AdicionarClienteForm>({
    resolver: zodResolver(adicionarClienteSchema),
    mode: "onBlur",
  });

  const getFieldValidationClassLocal = () => {
    const isTouched = !!touchedFields.email;
    const hasError = !!errors.email;
    const isDirty = !!dirtyFields.email;
    const value = watch("email");
    
    if (!isTouched) return "";
    
    if (hasError) return "border-red-500 focus:border-red-500";
    
    // Só mostra verde se foi alterado, não há erro, e o valor parece um email válido
    if (isDirty && !hasError && value && value.includes("@") && value.includes(".")) {
      return "border-green-500 focus:border-green-500";
    }
    
    return "";
  };

  const onSubmitExisting = async (data: ExistingClientForm) => {
    setIsLoading(true);
    try {
      // TODO: Implementar busca e vinculação de cliente existente
      console.log("Buscando cliente existente:", data.searchEmail);
      
      // Simulação de busca
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success("Cliente vinculado com sucesso!");
      reset();
      onClose();
    } catch (err) {
      showError("Cliente não encontrado ou erro ao vincular.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
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
        <Tabs defaultValue="invite" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Convidar Novo</TabsTrigger>
            <TabsTrigger value="existing">Cliente Existente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invite" className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do Cliente</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@email.com"
                    className={getFieldValidationClassLocal()}
                    {...register("email")}
                  />
                  {errors.email && touchedFields.email && (
                    <span className="text-sm text-red-500">{errors.email.message}</span>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" className="border border-gray-300" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="border border-gray-300" disabled={!isValid || isLoading}>
                  {isLoading ? "Gerando..." : "Gerar Link de Convite"}
                </Button>
              </DialogFooter>
            </form>
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
