import { NavbarWeb } from "@/components/comum/navbarWeb";
import { HomeWebAdvogado } from "../homeAdvogado/homeWebAdvogado";
import { HomeWebCliente } from "../homeCliente/homeWebCliente";


export function HomeWeb() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarWeb />
                <HomeWebCliente />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <HomeWebAdvogado />
            </div>
        );
    }

}