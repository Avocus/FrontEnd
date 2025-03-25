"use client";
import { Configs } from "@/components/perfil/configs";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

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
        <AuthGuard>
            <AppLayout>
                <Configs />
            </AppLayout>
        </AuthGuard>
    );
}