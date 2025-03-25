"use client"

import { useEffect } from "react";
import { Casos } from "@/components/casos/Casos";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CasosPage() {
    const { updateConfig, isAdvogado } = useLayout();

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: isAdvogado,
            showFooter: true
        });
    }, [updateConfig, isAdvogado]);

    return (
        <AuthGuard>
            <AppLayout>
                <Casos />
            </AppLayout>
        </AuthGuard>
    );
}