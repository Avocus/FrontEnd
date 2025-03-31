"use client";
import { HomeCliente } from "@/components/home/homeCliente/HomeCliente";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function Home() {
  const { updateConfig } = useLayout();

  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: true,
      showFooter: true
    });
  }, [updateConfig]);

  return (
    <HomeCliente/>
  );
}
