"use client";

import { Navbar } from "../comum/navbar";
import { ServicosAdvogado } from "./advogado/servicosAdvogado";
import { ServicosCliente } from "./cliente/servicosCliente";

export function ServicosComum() {
    const isClient = true; // Aqui você pode usar a lógica correta para determinar se é cliente ou advogado

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