/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect } from "react";
import { Casos } from "@/components/casos/Casos";
import { useLayout } from "@/contexts/LayoutContext";
import Novo from "@/components/casos/Novo";

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
        <Novo />
    );
}