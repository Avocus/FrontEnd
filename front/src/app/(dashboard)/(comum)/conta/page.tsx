"use client"

import { DadosUsuario } from "@/components/perfil/infosPerfil/dados/dadosUsuario";
import { useLayout } from "@/contexts/LayoutContext";
import { useEffect } from "react";

export default function Dados() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig, isAdvogado]);

    return (
        <DadosUsuario />
    );
}