"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar } from "lucide-react";

// Dados mockados - substituir por dados reais do store/API
const clientesMock = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    status: "ativo",
    dataCadastro: "2024-01-15",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 88888-8888",
    status: "pendente",
    dataCadastro: "2024-02-20",
  },
];

export function ListaClientes() {
  const [clientes] = useState(clientesMock);

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
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {cliente.telefone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={cliente.status === "ativo" ? "default" : "secondary"}
                  >
                    {cliente.status === "ativo" ? "Ativo" : "Pendente"}
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
