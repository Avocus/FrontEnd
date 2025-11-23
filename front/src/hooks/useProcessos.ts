import { useState, useEffect, useCallback } from "react";
import { useAuthStore, useProcessoStore } from "@/store";
import { ProcessoAdvogado, ProcessoCliente } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";

export function useProcessosFromStore() {
  const { processosCliente, carregarProcessosCliente } = useProcessoStore();
  const [isLoading, setIsLoading] = useState(true);

  const carregarProcessos = useCallback(async () => {
    try {
      await carregarProcessosCliente();
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
      setIsLoading(false);
    }
  }, [carregarProcessosCliente]);

  useEffect(() => {
    carregarProcessos();
  }, [carregarProcessos]);

  return { processos: processosCliente, isLoading };
}

export function useProcessosPendentes() {
  const { processosCliente } = useProcessoStore();
  const [loading, setLoading] = useState(true);

  const carregarProcessosPendentes = useCallback(() => {
    try {
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar processos pendentes:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProcessosPendentes();
  }, [carregarProcessosPendentes]);

  const processosPendentes = processosCliente.filter((processo: ProcessoCliente) => processo.status === StatusProcesso.PENDENTE);

  return { processosPendentes, loading, recarregar: carregarProcessosPendentes };
}

export function useProcessosAdvogado() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { processosAdvogado, carregarProcessosAdvogado } = useProcessoStore();

  const carregarProcessos = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      await carregarProcessosAdvogado();
    } catch (error) {
      console.error("Erro ao carregar processos do advogado:", error);
    } finally {
      setLoading(false);
    }
  }, [user, carregarProcessosAdvogado]);

  useEffect(() => {
    carregarProcessos();
  }, [carregarProcessos]);

  return { processosAdvogado, loading, recarregar: carregarProcessos };
}