/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, Suspense } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const MeusCasos = React.lazy(() => import("@/components/casos/MeusCasos"));

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
        <ErrorBoundary>
            <Suspense fallback={
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Carregando casos...</span>
                </div>
            }>
                <MeusCasos />
            </Suspense>
        </ErrorBoundary>
    );
}