"use client";
import { VideotecaMobile } from "@/components/videoteca/videotecaMobile";
import { VideotecaWeb } from "@/components/videoteca/videotecaWeb";
import { FooterMobile } from "@/components/comum/footerMobile";
import { NavbarMobile } from "@/components/comum/navbarMobile";
import { NavbarWeb } from "@/components/comum/navbarWeb";
import { useState, useEffect } from "react";
import { AcessoNegado } from "../acesso-negado/acessoNegado";

export default function Videoteca() {
    const [isMobile, setIsMobile] = useState(false);
    const usuario = JSON.parse(sessionStorage.getItem("usuario")!);
    const isClient = usuario.userCredential.data.client === true;

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

    return isClient ? (isMobile ?
    <div>
        <NavbarMobile />
        <div className="mt-16 mb-16">
            <VideotecaMobile />
        </div>
        <FooterMobile />
    </div>
    :
    <div>
        <NavbarWeb />
        <VideotecaWeb />
    </div>) : <div>
        <AcessoNegado />
    </div>
}
