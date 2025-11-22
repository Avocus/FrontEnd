/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect } from "react";
import { DetalheCasoWrapper } from "@/components/casos/Casos";
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
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

    return (
        <>
            <Link href="/casos" className="">
                <Button variant="outline" size="sm">← Voltar para casos</Button>
            </Link>
            <DetalheCasoWrapper casoId={casoId} />
        </>
    );
}