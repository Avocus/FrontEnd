/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Loader2, Search } from "lucide-react";
import { ClienteLista } from "@/types/entities/Cliente";
import { getMeusClientes } from "@/services/advogado/advogadoService";
import { useToast } from "@/hooks/useToast";

export function ListaClientes() {
  const [clientes, setClientes] = useState<ClienteLista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { error: showError } = useToast();

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setIsLoading(true);
        const data = await getMeusClientes();
        setClientes(data);
      } catch (error) {
        showError('Erro ao carregar lista de clientes: ' + error);
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

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar clientes por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      {filteredClientes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {clientes.length === 0 ? "Nenhum cliente cadastrado ainda." : "Nenhum cliente encontrado."}
        </div>
      ) : (
        filteredClientes.map((cliente) => (
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
