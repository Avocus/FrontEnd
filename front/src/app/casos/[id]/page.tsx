"use client"

import { useEffect } from "react";
import { DetalheCaso } from "@/components/casos/Casos";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLayout } from "@/contexts/LayoutContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DetalheCasoPage() {
    const { updateConfig, isAdvogado } = useLayout();
    const params = useParams();
    const casoId = params?.id as string;

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: isAdvogado,
            showFooter: true
        });
    }, [updateConfig, isAdvogado]);

    return (
        <AppLayout>
            <Link href="/casos" className="">
                <Button variant="outline" size="sm">← Voltar para casos</Button>
            </Link>
            <DetalheCaso casoId={casoId} />
        </AppLayout>
    );
}