"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, User, Plus, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMeusClientes } from "@/services/advogado/advogadoService";
import { ClienteLista } from "@/types/entities/Cliente";

interface ModalBuscaClienteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteSelect: (cliente: ClienteLista) => void;
  onNovoCliente?: () => void;
}

export function ModalBuscaCliente({
  isOpen,
  onOpenChange,
  onClienteSelect,
  onNovoCliente
}: ModalBuscaClienteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<ClienteLista[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteLista[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadClientes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClientes(clientes);
    } else {
      const clientesArray = Array.isArray(clientes) ? clientes : [];
      const filtered = clientesArray.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.telefone && cliente.telefone.includes(searchTerm)) ||
        (cliente.cpf && cliente.cpf.includes(searchTerm))
      );
      setFilteredClientes(filtered);
    }
  }, [searchTerm, clientes]);

  const loadClientes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clientesData = await getMeusClientes();
      const clientesArray = Array.isArray(clientesData) ? clientesData : [];
      setClientes(clientesArray);
      setFilteredClientes(clientesArray);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar lista de clientes. Tente novamente.');
      setClientes([]);
      setFilteredClientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClienteSelect = (cliente: ClienteLista) => {
    onClienteSelect(cliente);
    onOpenChange(false);
    setSearchTerm("");
  };

  const handleNovoCliente = () => {
    if (onNovoCliente) {
      onNovoCliente();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por nome, email, telefone ou CPF</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Lista de clientes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Clientes encontrados ({filteredClientes.length})</Label>
              <div className="flex gap-2">
                {onNovoCliente && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNovoCliente}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Cliente
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm}
                >
                  Limpar busca
                </Button>
              </div>
            </div>

            <ScrollArea className="h-64 border rounded-md">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando clientes...</div>
                </div>
              ) : filteredClientes.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <User className="h-8 w-8 mb-2" />
                  <div>Nenhum cliente encontrado</div>
                  {searchTerm && (
                    <div className="text-sm">Tente ajustar sua busca</div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredClientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleClienteSelect(cliente)}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {cliente.email}
                        </div>
                        {cliente.telefone && (
                          <div className="text-sm text-muted-foreground">
                            {cliente.telefone}
                          </div>
                        )}
                        {cliente.cpf && (
                          <div className="text-sm text-muted-foreground">
                            CPF: {cliente.cpf}
                          </div>
                        )}
                        {cliente.processosAtivos && cliente.processosAtivos > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {cliente.processosAtivos} processo(s) ativo(s)
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}