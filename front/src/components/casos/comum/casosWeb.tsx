import { NavbarWeb } from "@/components/comum/navbarWeb";
import { ListaCasosAdvogadoWeb } from "../advogado/listaCasosAdvogadoWeb";
import { ListaCasosClienteWeb } from "../cliente/listaCasosClienteWeb";
import { useAuthStore } from "@/store";

export function CasosWeb() {

    const { user } = useAuthStore();

    if (user?.client) {
        return (
            <div>
                <NavbarWeb />
                <div className="mt-16 mb-16">
                    <ListaCasosClienteWeb />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <ListaCasosAdvogadoWeb />
            </div>
        );
    }

}