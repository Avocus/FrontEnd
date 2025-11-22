import { useState, useEffect } from "react";
import { CasoCliente, CasoAdvogado } from "@/types/entities";
import { useCasoStore } from "@/store";

interface UseCasoDetalhesProps {
  casoId: string;
  isAdvogado: boolean;
}

export function useCasoDetalhes({ casoId, isAdvogado }: UseCasoDetalhesProps) {
  const [caso, setCaso] = useState<CasoCliente | CasoAdvogado | null>(null);
  const [loading, setLoading] = useState(false);
  const { buscarCasoClientePorId, buscarCasoAdvogadoPorId } = useCasoStore();

  useEffect(() => {
    const carregarCaso = async () => {
      setLoading(true);
      try {
        let casoEncontrado;
        if (isAdvogado) {
          casoEncontrado = await buscarCasoAdvogadoPorId(casoId);
        } else {
          casoEncontrado = await buscarCasoClientePorId(casoId);
        }
        setCaso(casoEncontrado);
      } catch (error) {
        console.error('Erro ao carregar caso:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarCaso();
  }, [casoId, isAdvogado, buscarCasoClientePorId, buscarCasoAdvogadoPorId]);

  return {
    caso,
    loading
  };
}