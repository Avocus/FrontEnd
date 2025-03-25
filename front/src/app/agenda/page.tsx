"use client";
import { Calendario } from "@/components/agenda/calendario";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AgendaPage() {
  const { updateConfig, isAdvogado } = useLayout();

  useEffect(() => {
    // Configuração específica para a página Agenda
    updateConfig({
      showNavbar: true,
      showSidebar: isAdvogado, // Mostrar sidebar apenas para advogados
      showFooter: true
    });
  }, [updateConfig, isAdvogado]);

  return (
    <AuthGuard>
      <AppLayout>
        <Calendario />
      </AppLayout>
    </AuthGuard>
  );
}