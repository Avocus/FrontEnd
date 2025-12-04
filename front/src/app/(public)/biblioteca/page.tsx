"use client";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { Biblioteca } from "@/components/biblioteca/biblioteca";


export default function BibliotecaPage() {
  const { updateConfig, isAdvogado } = useLayout();
  
  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: true,
      showFooter: true
    });
  }, [updateConfig, isAdvogado]);

  
  return (
    <>
      <Biblioteca />
    </>
  );
}