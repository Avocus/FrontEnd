import { FooterMobile } from "../comum/footerMobile";
import { NavbarMobile } from "../comum/navbarMobile";
import { ServicosAdvogadoMobile } from "./advogado/servicosAdvogadoMobile";
import { ServicosClienteMobile } from "./cliente/servicosClienteMobile";

export function ServicosComumMobile () {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarMobile />
                <div className="mt-20 mb-20">
                    <ServicosClienteMobile />
                </div>
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarMobile />
                <ServicosAdvogadoMobile />
                <FooterMobile />
            </div>
        );
    }
}