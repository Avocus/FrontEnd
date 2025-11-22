"use client";

import { Navbar } from "../comum/navbar";
import { ServicosAdvogado } from "./advogado/servicosAdvogado";
import { ServicosCliente } from "./cliente/servicosCliente";
import { useLayout } from "@/contexts/LayoutContext";

export function ServicosComum() {

    const { isCliente } = useLayout();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <div>
                {isCliente ? (
                    <ServicosCliente />
                ) : (
                    <ServicosAdvogado />
                )}
            </div>
        </div>
    );
} 