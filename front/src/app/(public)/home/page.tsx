"use client";
import { HomeAdvogado } from "@/components/home/homeAdvogado/HomeAdvogado";
import { HomeCliente } from "@/components/home/homeCliente/HomeCliente";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { useAuthStore } from '@/store';
import AuthGuard from '@/components/auth/AuthGuard';

export default function Home() {
  const { updateConfig } = useLayout();
  const { user } = useAuthStore();
  const isCliente = Boolean(user && user.client);
  
  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: true,
      showFooter: true
    });
  }, [updateConfig]);

  return (
    <AuthGuard>
      {isCliente ? <HomeCliente /> : <HomeAdvogado />}
    </AuthGuard>
  );
}
