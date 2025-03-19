import { NavbarWeb } from "@/components/comum/navbarWeb";
import { ListaCasosAdvogadoWeb } from "../advogado/listaCasosAdvogadoWeb";
import { ListaCasosClienteWeb } from "../cliente/listaCasosClienteWeb";


export function CasosWeb() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario")!);
    const isClient = usuario.userCredential.data.client === true;

    if (isClient) {
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