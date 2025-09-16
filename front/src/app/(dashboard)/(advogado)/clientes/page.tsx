"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ListaClientes } from "@/components/clientes/ListaClientes";
import { ModalAdicionarCliente } from "@/components/clientes/ModalAdicionarCliente";

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect clients away from this page
    if (user && user.client) {
      router.push('/advogados');
    }
  }, [user, router]);

  // Don't render if user is a client
  if (user && user.client) {
    return null;
  }

  const handleClienteVinculado = () => {
    setRefreshKey(prev => prev + 1); // Força recarga da lista
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Clientes</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="border border-gray-300">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ListaClientes key={refreshKey} />
        </CardContent>
      </Card>

      <ModalAdicionarCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClienteVinculado={handleClienteVinculado}
      />
    </div>
  );
}
