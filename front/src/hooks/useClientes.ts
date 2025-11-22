import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store";
import { ClienteLista } from "@/types/entities/Cliente";
import { getMeusClientes } from "@/services/advogado/advogadoService";

export function useClientes() {
  const [clientes, setClientes] = useState<ClienteLista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const carregarClientes = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const clientesData = await getMeusClientes();
      setClientes(clientesData);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setError("Erro ao carregar lista de clientes");
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  return {
    clientes,
    isLoading,
    error,
    recarregar: carregarClientes
  };
}