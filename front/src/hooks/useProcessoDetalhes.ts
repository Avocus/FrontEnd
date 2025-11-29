import { useState, useEffect, useCallback } from "react";
import { ProcessoCliente, ProcessoAdvogado } from "@/types/entities";
import { useProcessoStore } from "@/store";

interface UseProcessoDetalhesProps {
  processoId: string;
  isAdvogado: boolean;
}

export function useProcessoDetalhes({ processoId, isAdvogado }: UseProcessoDetalhesProps) {
  const [processo, setProcesso] = useState<ProcessoCliente | ProcessoAdvogado | null>(null);
  const [loading, setLoading] = useState(false);
  const { buscarProcessoClientePorId, buscarProcessoAdvogadoPorId } = useProcessoStore();

  const carregarProcesso = useCallback(async () => {
    setLoading(true);
    try {
      let processoEncontrado;
      if (isAdvogado) {
        processoEncontrado = await buscarProcessoAdvogadoPorId(processoId);
      } else {
        processoEncontrado = await buscarProcessoClientePorId(processoId);
      }
      setProcesso(processoEncontrado);
    } catch (error) {
      console.error('Erro ao carregar processo:', error);
    } finally {
      setLoading(false);
    }
  }, [processoId, isAdvogado, buscarProcessoClientePorId, buscarProcessoAdvogadoPorId]);

  useEffect(() => {
    carregarProcesso();
  }, [carregarProcesso]);

  return {
    processo,
    setProcesso,
    loading,
    refetch: carregarProcesso
  };
}