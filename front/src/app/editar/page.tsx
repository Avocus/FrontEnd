"use client"

import { useEffect, useState } from "react";
import { EditarComumMobile } from "@/components/perfil/infosPerfil/editar/editarComumMobile";
import { EditarComumWeb } from "@/components/perfil/infosPerfil/editar/editarComumWeb";

export default function Editar() {
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

    return isMobile ? <EditarComumMobile /> : <EditarComumWeb />;
}