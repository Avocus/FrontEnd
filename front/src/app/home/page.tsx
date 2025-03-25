"use client";
import { HomeCliente } from "@/components/home/homeCliente/HomeCliente";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Home() {
  const { updateConfig } = useLayout();

  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: false,
      showFooter: true
    });
  }, [updateConfig]);

  return (
    <AuthGuard requireAuth={false}>
      <AppLayout>
        <HomeCliente/>
      </AppLayout>
    </AuthGuard>
  );
}
