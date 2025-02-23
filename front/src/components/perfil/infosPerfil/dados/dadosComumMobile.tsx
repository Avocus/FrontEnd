import { NavbarMobile } from "@/components/comum/navbarMobile";
import { DadosAdvogadoMobile } from "./advogado/dadosAdvogadoMobile";
import { DadosClienteMobile } from "./cliente/dadosClienteMobile";
import { FooterMobile } from "@/components/comum/footerMobile";


export function DadosComumMobile() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarMobile />
                <div className="mt-16 mb-16">
                    <DadosClienteMobile />
                </div>
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarMobile />
                <DadosAdvogadoMobile />
                <FooterMobile />
            </div>
        );
    }

}