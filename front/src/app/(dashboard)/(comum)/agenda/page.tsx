"use client";
import React, { Suspense } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const Calendario = React.lazy(() => import("@/components/agenda/calendario").then(module => ({ default: module.Calendario })));

export default function AgendaPage() {
  const { updateConfig } = useLayout();

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
      showSidebar: true,
      showFooter: true
    });
  }, [updateConfig]);

  return (
    <AuthGuard>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando agenda...</span>
          </div>
        }>
          <Calendario />
        </Suspense>
      </ErrorBoundary>
    </AuthGuard>
  );
}