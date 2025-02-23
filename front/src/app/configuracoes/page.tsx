"use client";
import { useState, useEffect } from "react";
import { FooterMobile } from "@/components/comum/footerMobile";
import { NavbarMobile } from "@/components/comum/navbarMobile";
import { NavbarWeb } from "@/components/comum/navbarWeb";
import { Configs } from "@/components/perfil/configs";

export default function Configuracoes() {
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


    if (isMobile) {
        return (
            <div>
                <NavbarMobile />
                <Configs />
                <FooterMobile />
            </div>
        );
    } else {
        return (
            <div>
                <NavbarWeb />
                <Configs />
            </div>
        );
    }
}