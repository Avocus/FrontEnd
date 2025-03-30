"use client";
import { Configs } from "@/components/perfil/configs";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function Configuracoes() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        // Configuração específica para a página de Configurações
        updateConfig({
            showNavbar: true,
            showSidebar: isAdvogado, // Mostrar sidebar apenas para advogados
            showFooter: true
        });
    }, [updateConfig, isAdvogado]);

    return (
        <Configs />
    );
}