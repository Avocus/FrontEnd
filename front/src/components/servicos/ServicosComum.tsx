"use client";

import { Navbar } from "../comum/navbar";
import { ServicosAdvogadoMobile } from "./advogado/servicosAdvogadoMobile";
import { ServicosAdvogadoWeb } from "./advogado/servicosAdvogadoWeb";
import { ServicosClienteMobile } from "./cliente/servicosClienteMobile";
import { ServicosClienteWeb } from "./cliente/servicosClienteWeb";
import { useResponsive } from "@/hooks/useResponsive";

export function ServicosComum() {
    const { isMobile } = useResponsive();
    const isClient = true; // Aqui você pode usar a lógica correta para determinar se é cliente ou advogado

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div className={`${isMobile ? "mt-16 mb-16" : ""}`}>
                {isClient ? (
                    isMobile ? <ServicosClienteMobile /> : <ServicosClienteWeb />
                ) : (
                    isMobile ? <ServicosAdvogadoMobile /> : <ServicosAdvogadoWeb />
                )}
            </div>
        </div>
    );
} 