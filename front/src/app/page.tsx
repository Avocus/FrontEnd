'use client'

import { HomeCliente } from "@/components/home/homeCliente/HomeCliente";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function Home() {
  const { updateConfig, isAdvogado } = useLayout();

  useEffect(() => {
    // Configuração específica para a página inicial
    updateConfig({
      showNavbar: true,
      showSidebar: isAdvogado, // Mostrar sidebar apenas para advogados
      showFooter: true
    });
  }, [updateConfig, isAdvogado]);

  return (
    <HomeCliente />
  );
}
