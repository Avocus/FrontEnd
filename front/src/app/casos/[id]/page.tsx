"use client"

import { useEffect, useState } from "react";
import { DetalhesCasosMobile } from "@/components/casos/comum/detalhesCasosMobile";
import { DetalhesCasosWeb } from "@/components/casos/comum/detalhesCasosWeb";
import { useParams } from "next/navigation";

export default function Dados() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleMediaChange = (event: any) => {
            setIsMobile(event.matches);
        };

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    return isMobile ? <DetalhesCasosMobile casoId={id as string} /> : <DetalhesCasosWeb casoId={id as string} />;
}