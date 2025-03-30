import { ServicosAdvogadoWeb } from "./advogado/servicosAdvogadoWeb";
import { ServicosClienteWeb } from "./cliente/servicosClienteWeb";

export function ServicosComumWeb () {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <ServicosClienteWeb/>
            </div>
        );
    } else {
        return (
            <div>
                <ServicosAdvogadoWeb />
            </div>
        );
    }
}