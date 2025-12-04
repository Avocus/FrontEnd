/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { DetalheProcessoWrapper } from "@/components/processos/Processos";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function DetalheProcessoPage() {
    const { updateConfig } = useLayout();
    const params = useParams();
    const processoId = params?.id as string;

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

    return (
        <>
            <Link href="/processos" className="">
                <Button variant="outline" size="sm">← Voltar para processos</Button>
            </Link>
            <DetalheProcessoWrapper processoId={processoId} />
        </>
    );
}