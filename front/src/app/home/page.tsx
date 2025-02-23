"use client";
import { HomeMobile } from "@/components/home/comum/homeMobile";
import { HomeWeb } from "@/components/home/comum/homeWeb";
import { useState, useEffect } from "react";

export default function Home() {
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

    return isMobile ? <HomeMobile /> : <HomeWeb />;
}
