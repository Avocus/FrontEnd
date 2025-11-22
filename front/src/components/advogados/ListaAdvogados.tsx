/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ListaEntidade, EntityItem } from "@/components/common/ListaEntidade";
import { AdvogadoLista } from "@/types/entities/Advogado";
import { getMeusAdvogados } from "@/services/cliente/clienteService";

export function ListaAdvogados() {
  const handleDetailsClick = (advogado: AdvogadoLista) => {
    // Implementar navegação para detalhes
    console.log('Ver detalhes do advogado:', advogado.id);
  };

  return (
    <ListaEntidade<AdvogadoLista>
      loadFunction={getMeusAdvogados}
      hasSearch={false}
      onDetailsClick={handleDetailsClick}
    />
  );
}