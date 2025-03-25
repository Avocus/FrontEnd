"use client";

import { NavbarWeb } from "@/components/comum/navbarWeb";
import { DetalheCasosAdvogadoWeb } from "../advogado/detalheCasosAdvogadoWeb";
import { DetalheCasosClienteWeb } from "../cliente/detalheCasosClienteWeb";
import { useAuthStore } from "@/store";

interface DetalhesCasosWebProps {
    casoId: string;
}

export function DetalhesCasosWeb ({ casoId }: DetalhesCasosWebProps) {

    const { user } = useAuthStore();

    return (
        <div>
            <NavbarWeb />
            {user?.client ? (
                <DetalheCasosClienteWeb casoId={casoId} />
            ) : (
                <DetalheCasosAdvogadoWeb casoId={casoId} />
            )}
        </div>
    );
}