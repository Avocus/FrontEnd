import { useState, useEffect } from "react";
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

  useEffect(() => {
    const carregarProcesso = async () => {
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
    };

    carregarProcesso();
  }, [processoId, isAdvogado, buscarProcessoClientePorId, buscarProcessoAdvogadoPorId]);

  return {
    processo,
    setProcesso,
    loading
  };
}