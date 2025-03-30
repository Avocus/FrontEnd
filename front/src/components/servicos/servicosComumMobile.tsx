import { ServicosAdvogadoMobile } from "./advogado/servicosAdvogadoMobile";
import { ServicosClienteMobile } from "./cliente/servicosClienteMobile";

export function ServicosComumMobile () {
    const isClient = true;

    if (isClient) {
        return (
            <div>
                <div className="mt-20 mb-20">
                    <ServicosClienteMobile />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <ServicosAdvogadoMobile />
            </div>
        );
    }
}