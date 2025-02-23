import { NavbarWeb } from "@/components/comum/navbarWeb";
import { EditarAdvogadoWeb } from "./advogado/editarAdvogadoWeb";
import { EditarClienteWeb } from "./cliente/editarClienteWeb";

export function EditarComumWeb() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarWeb />
                <EditarClienteWeb/>
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <EditarAdvogadoWeb />
            </div>
        );
    }

}