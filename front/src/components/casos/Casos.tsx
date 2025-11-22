"use client";

import Link from "next/link";
import { DetalheCaso } from "./DetalheCaso";
import { DetalheCasoAdvogado } from "./CasosAdvogado";
import { useLayout } from "@/contexts/LayoutContext";

export function DetalheCasoWrapper({ casoId }: { casoId: string | string[] | undefined }) {
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
  
  return isAdvogado ? <DetalheCasoAdvogado casoId={casoId} /> : <DetalheCaso casoId={casoId} />;
} 