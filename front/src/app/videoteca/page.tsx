"use client";
import { Videoteca } from "@/components/videoteca/Videoteca";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function VideotecaPage() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        // Configuração específica para a página de Videoteca
        updateConfig({
            showNavbar: true,
            showSidebar: isAdvogado, // Mostrar sidebar apenas para advogados
            showFooter: false // Esconder o footer para a videoteca
        });
    }, [updateConfig, isAdvogado]);

    return (
        <AppLayout>
            <Videoteca />
        </AppLayout>
    )
}
