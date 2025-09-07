"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Plus } from "lucide-react";
import { ListaClientes } from "@/components/clientes/ListaClientes";
import { ModalAdicionarCliente } from "@/components/clientes/ModalAdicionarCliente";

export default function ClientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = () => {
    const url = window.location.origin + "/cadastro";
    navigator.share?.({
      title: "Cadastre-se no Avocuss",
      text: "Junte-se à nossa plataforma jurídica",
      url,
    }) || navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meus Clientes</h1>
        <div className="flex gap-2">
          <Button onClick={handleShare} variant="default" className="border border-gray-300">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar Cadastro
          </Button>
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
          <ListaClientes />
        </CardContent>
      </Card>

      <ModalAdicionarCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
