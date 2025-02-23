import { NavbarMobile } from "@/components/comum/navbarMobile";
import { EditarAdvogadoMobile } from "./advogado/editarAdvogadoMobile";
import { EditarClienteMobile } from "./cliente/editarClienteMobile";
import { FooterMobile } from "@/components/comum/footerMobile";


export function EditarComumMobile() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarMobile />
                <div className="mt-16 mb-16">
                    <EditarClienteMobile />
                </div>
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarMobile />
                <EditarAdvogadoMobile />
                <FooterMobile />
            </div>
        );
    }

}