"use client"

import React, { useEffect, Suspense } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const MeusProcessos = React.lazy(() => import("@/components/processos/MeusProcessos"));

export default function ProcessosPage() {
    const { updateConfig } = useLayout();

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
                    <span className="ml-2">Carregando processos...</span>
                </div>
            }>
                <MeusProcessos />
            </Suspense>
        </ErrorBoundary>
    );
}