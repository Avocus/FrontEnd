/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { DetalheCasoWrapper } from "@/components/casos/Casos";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function DetalheCasoPage() {
    const { updateConfig } = useLayout();
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