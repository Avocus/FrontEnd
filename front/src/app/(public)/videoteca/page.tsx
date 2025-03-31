"use client";
import { Videoteca } from "@/components/videoteca/Videoteca";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function VideotecaPage() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        // Configuração específica para a página de Videoteca
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: false
        });
    }, [updateConfig, isAdvogado]);

    return (
        <Videoteca />
    )
}
