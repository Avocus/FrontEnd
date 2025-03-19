import { NavbarMobile } from "@/components/comum/navbarMobile";
import { FooterMobile } from "@/components/comum/footerMobile";
import { ListaCasosAdvogadoMobile } from "../advogado/listaCasosAdvogadoMobile";
import { ListaCasosClienteMobile } from "../cliente/listaCasosClienteMobile";


export function CasosMobile() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario")!);
    const isClient = usuario.userCredential.data.client === true;

    if (isClient) {
        return (
            <div>
                <NavbarMobile />
                <div className="mt-16 mb-16">
                    <ListaCasosClienteMobile />
                </div>
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarMobile />
                <ListaCasosAdvogadoMobile />
                <FooterMobile />
            </div>
        );
    }

}