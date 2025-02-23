"use client"

import { useEffect, useState } from "react";
import { DadosComumMobile } from "@/components/perfil/infosPerfil/dados/dadosComumMobile";
import { DadosComumWeb } from "@/components/perfil/infosPerfil/dados/dadosComumWeb";

export default function Dados() {
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

    return isMobile ? <DadosComumMobile /> : <DadosComumWeb />;
}