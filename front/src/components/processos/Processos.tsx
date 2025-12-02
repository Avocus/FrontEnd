"use client";

import Link from "next/link";
import { DetalheProcesso } from "./DetalheProcesso";
import { DetalheProcessoAdvogado } from "./DetalheProcessoAdvogado";
import { useLayout } from "@/contexts/LayoutContext";

export function DetalheProcessoWrapper({ processoId }: { processoId: string | string[] | undefined }) {
  const { isAdvogado } = useLayout();

  if (!processoId || Array.isArray(processoId)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Processo não encontrado</h1>
        <p className="text-muted-foreground mb-4">O processo solicitado não foi encontrado ou o identificador é inválido.</p>
        <Link href="/processos" className="text-primary-foreground underline">Voltar para lista de processos</Link>
      </div>
    );
  }
  
  return isAdvogado ? <DetalheProcessoAdvogado processoId={processoId} /> : <DetalheProcesso processoId={processoId} />;
} 