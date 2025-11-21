/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect } from "react";
import MeusCasos from "@/components/casos/MeusCasos";
import { useLayout } from "@/contexts/LayoutContext";

export default function CasosPage() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

    return (
        <MeusCasos />
    );
}