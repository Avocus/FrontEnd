"use client";

import { NavbarMobile } from "@/components/comum/navbarMobile";
import { DetalheCasosAdvogadoMobile } from "../advogado/detalheCasosAdvogadoMobile";
import { DetalheCasosClienteMobile } from "../cliente/detalheCasosClienteMobile";
import { FooterMobile } from "@/components/comum/footerMobile"; // Certifique-se de importar o FooterMobile

interface DetalhesCasosMobileProps {
    casoId: string;
}

export function DetalhesCasosMobile({ casoId }: DetalhesCasosMobileProps) {
    const usuario = JSON.parse(sessionStorage.getItem("usuario")!);
    const isClient = usuario.userCredential.data.client === true;

    return (
        <div>
            <NavbarMobile />
            <div className="mt-16 mb-16">
                {isClient ? (
                    <DetalheCasosClienteMobile casoId={casoId} />
                ) : (
                    <DetalheCasosAdvogadoMobile casoId={casoId} />
                )}
            </div>
            <FooterMobile />
        </div>
    );
}