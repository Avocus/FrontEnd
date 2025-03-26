"use client";

import { useLayout } from "@/contexts/LayoutContext";
import { CasosAdvogado, DetalheCasoAdvogado } from "./CasosAdvogado";
import { CasosCliente, DetalheCasoCliente } from "./CasosCliente";
import Link from "next/link";

export function Casos() {
  const { isAdvogado } = useLayout();
  
  return isAdvogado ? <CasosAdvogado /> : <CasosCliente />;
}

export function DetalheCaso({ casoId }: { casoId: string | string[] | undefined }) {
  const { isAdvogado } = useLayout();
  
  if (!casoId || Array.isArray(casoId)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Caso não encontrado</h1>
        <p className="text-muted-foreground mb-4">O caso solicitado não foi encontrado ou o identificador é inválido.</p>
        <Link href="/casos" className="text-primary underline">Voltar para lista de casos</Link>
      </div>
    );
  }
  
  return isAdvogado ? 
    <DetalheCasoAdvogado casoId={casoId} /> : 
    <DetalheCasoCliente casoId={casoId} />;
} 