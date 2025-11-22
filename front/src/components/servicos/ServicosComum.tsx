"use client";

import { Navbar } from "../comum/navbar";
import { ServicosAdvogado } from "./advogado/servicosAdvogado";
import { ServicosCliente } from "./cliente/servicosCliente";
import { useLayout } from "@/contexts/LayoutContext";

export function ServicosComum() {

    const { isClient } = useLayout();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div>
                {isClient ? (
                    <ServicosCliente />
                ) : (
                    <ServicosAdvogado />
                )}
            </div>
        </div>
    );
} 