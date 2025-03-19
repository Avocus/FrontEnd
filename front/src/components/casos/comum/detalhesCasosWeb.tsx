"use client";

import { NavbarWeb } from "@/components/comum/navbarWeb";
import { DetalheCasosAdvogadoWeb } from "../advogado/detalheCasosAdvogadoWeb";
import { DetalheCasosClienteWeb } from "../cliente/detalheCasosClienteWeb";

interface DetalhesCasosWebProps {
    casoId: string;
}

export function DetalhesCasosWeb ({ casoId }: DetalhesCasosWebProps) {
    const usuario = JSON.parse(sessionStorage.getItem("usuario")!);
    const isClient = usuario.userCredential.data.client === true;

    return (
        <div>
            <NavbarWeb />
            {isClient ? (
                <DetalheCasosClienteWeb casoId={casoId} />
            ) : (
                <DetalheCasosAdvogadoWeb casoId={casoId} />
            )}
        </div>
    );
}