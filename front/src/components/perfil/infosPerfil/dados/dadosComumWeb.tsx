import { NavbarWeb } from "@/components/comum/navbarWeb";
import { DadosAdvogadoWeb } from "./advogado/dadosAdvogadoWeb";
import { DadosClienteWeb } from "./cliente/dadosClienteWeb";

export function DadosComumWeb() {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <NavbarWeb />
                <DadosClienteWeb/>
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <DadosAdvogadoWeb />
            </div>
        );
    }

}