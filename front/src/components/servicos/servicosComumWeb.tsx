import { NavbarWeb } from "../comum/navbarWeb";
import { ServicosAdvogadoWeb } from "./advogado/servicosAdvogadoWeb";
import { ServicosClienteWeb } from "./cliente/servicosClienteWeb";

export function ServicosComumWeb () {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarWeb />
                <ServicosClienteWeb/>
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <ServicosAdvogadoWeb />
            </div>
        );
    }
}