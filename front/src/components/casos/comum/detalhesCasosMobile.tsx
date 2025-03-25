"use client";

import { NavbarMobile } from "@/components/comum/navbarMobile";
import { DetalheCasosAdvogadoMobile } from "../advogado/detalheCasosAdvogadoMobile";
import { DetalheCasosClienteMobile } from "../cliente/detalheCasosClienteMobile";
import { FooterMobile } from "@/components/comum/footerMobile"; // Certifique-se de importar o FooterMobile
import { useAuthStore } from "@/store";

interface DetalhesCasosMobileProps {
    casoId: string;
}

export function DetalhesCasosMobile({ casoId }: DetalhesCasosMobileProps) {

    const { user } = useAuthStore();

    return (
        <div>
            <NavbarMobile />
            <div className="mt-16 mb-16">
                {user?.client ? (
                    <DetalheCasosClienteMobile casoId={casoId} />
                ) : (
                    <DetalheCasosAdvogadoMobile casoId={casoId} />
                )}
            </div>
            <FooterMobile />
        </div>
    );
}