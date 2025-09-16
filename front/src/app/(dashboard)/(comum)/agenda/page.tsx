"use client";
import { Calendario } from "@/components/agenda/calendario";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function AgendaPage() {
  const { updateConfig, isAdvogado } = useLayout();

  const { updateAuth } = useAuth();
  useEffect(() => {
    updateAuth({
      requireAuth: true,
      redirectTo: "/login"
    });
  }, [updateAuth]);

  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: isAdvogado,
      showFooter: true
    });
  }, [isAdvogado, updateConfig]);

  return (
    <AuthGuard>
      <Calendario />
    </AuthGuard>
  );
}