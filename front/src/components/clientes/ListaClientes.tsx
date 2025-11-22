/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ListaEntidade } from "@/components/common/ListaEntidade";
import { ClienteLista } from "@/types/entities/Cliente";
import { getMeusClientes } from "@/services/advogado/advogadoService";

export function ListaClientes() {
  const handleDetailsClick = (cliente: ClienteLista) => {
    // Implementar navegação para detalhes
    console.log('Ver detalhes do cliente:', cliente.id);
  };

  return (
    <ListaEntidade<ClienteLista>
      loadFunction={getMeusClientes}
      hasSearch={true}
      searchPlaceholder="Buscar clientes por nome ou email..."
      onDetailsClick={handleDetailsClick}
    />
  );
}
