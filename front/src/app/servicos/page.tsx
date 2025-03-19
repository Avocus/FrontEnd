"use client"

import { ServicosComumMobile } from "@/components/servicos/servicosComumMobile";
import { ServicosComumWeb } from "@/components/servicos/servicosComumWeb";
import { useEffect, useState } from "react";


export default function Servicos() {
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

    return isMobile ? <ServicosComumMobile /> : <ServicosComumWeb />;
}