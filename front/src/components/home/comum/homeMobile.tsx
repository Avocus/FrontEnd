import { NavbarMobile } from "@/components/comum/navbarMobile";
import { HomeMobileAdvogado } from "../homeAdvogado/homeMobileAdvogado";
import { HomeMobileCliente } from "../homeCliente/homeMobileCliente";
import { FooterMobile } from "@/components/comum/footerMobile";


export function HomeMobile() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarMobile />
                <div className="mt-16 mb-16">
                    <HomeMobileCliente />
                </div>
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarMobile />
                <HomeMobileAdvogado />
                <FooterMobile />
            </div>
        );
    }

}