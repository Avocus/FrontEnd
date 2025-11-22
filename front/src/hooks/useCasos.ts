import { useState, useEffect, useCallback } from "react";
import { useAuthStore, useCasoStore } from "@/store";
import { CasoAdvogado, CasoCliente } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";

export function useCasosFromStore() {
  const { casosCliente, carregarCasosCliente } = useCasoStore();
  const [isLoading, setIsLoading] = useState(true);

  const carregarCasos = useCallback(async () => {
    try {
      await carregarCasosCliente();
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar casos:", error);
      setIsLoading(false);
    }
  }, [carregarCasosCliente]);

  useEffect(() => {
    carregarCasos();
  }, [carregarCasos]);

  return { casos: casosCliente, isLoading };
}

export function useCasosPendentes() {
  const { casosCliente } = useCasoStore();
  const [loading, setLoading] = useState(true);

  const carregarCasosPendentes = useCallback(() => {
    try {
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar casos pendentes:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCasosPendentes();
  }, [carregarCasosPendentes]);

  const casosPendentes = casosCliente.filter((caso: CasoCliente) => caso.status === StatusProcesso.PENDENTE);

  return { casosPendentes, loading, recarregar: carregarCasosPendentes };
}

export function useCasosAdvogado() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { casosAdvogado, carregarCasosAdvogado } = useCasoStore();

  const carregarCasos = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      await carregarCasosAdvogado();
    } catch (error) {
      console.error("Erro ao carregar casos do advogado:", error);
    } finally {
      setLoading(false);
    }
  }, [user, carregarCasosAdvogado]);

  useEffect(() => {
    carregarCasos();
  }, [carregarCasos]);

  return { casosAdvogado, loading, recarregar: carregarCasos };
}