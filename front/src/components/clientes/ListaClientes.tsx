"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Loader2 } from "lucide-react";
import { ClienteLista } from "@/types/entities/Cliente";
import { getMeusClientes } from "@/services/advogado/advogadoService";
import { useToast } from "@/hooks/useToast";

export function ListaClientes() {
  const [clientes, setClientes] = useState<ClienteLista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setIsLoading(true);
        const data = await getMeusClientes();
        setClientes(data);
      } catch (error) {
        showError('Erro ao carregar lista de clientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadClientes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clientes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cliente cadastrado ainda.
        </div>
      ) : (
        clientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{cliente.nome}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {cliente.email}
                    </div>
                    {cliente.telefone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {cliente.telefone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={cliente.status === "ativo" ? "default" : "secondary"}
                  >
                    {cliente.status === "ativo" ? "Ativo" : cliente.status === "pendente" ? "Pendente" : "Inativo"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
