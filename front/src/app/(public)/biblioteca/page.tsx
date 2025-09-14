"use client";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import { BibliotecaMobile } from "@/components/biblioteca/bibliotecaMobile";
import { BibliotecaWeb } from "@/components/biblioteca/bibliotecaWeb";


export default function BibliotecaPage() {
  const { updateConfig, isMobile, isAdvogado } = useLayout();
  
  useEffect(() => {
    updateConfig({
      showNavbar: true,
      showSidebar: true,
      showFooter: true
    });
  }, [updateConfig, isAdvogado]);

  
  return (
    <>
      {isMobile ? <BibliotecaMobile /> : <BibliotecaWeb />}
    </>
  );
}