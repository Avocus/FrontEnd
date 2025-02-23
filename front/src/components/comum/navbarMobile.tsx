"use client";
import { Button } from "../ui/button";
import { Bell, Settings } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Notificacoes } from "./notificacoes";

export function NavbarMobile() {
    const router = useRouter();
    const [notificacoesOpen, setNotificacoesOpen] = useState(false);
    

    useEffect(() => {
        if (!router) {
            console.error('NextRouter não foi montado.');
        }
    }, [router]);

    const handleSettingsClick = () => {
        if (router) {
            router.push('/configuracoes');
        }
    };
    const handleDadosPerilClick = () => {
        if (router) {
            router.push('/dados');
        }
    };

    return (
        <nav className="w-full fixed top-0 p-2 bg-secondary text-secondary-foreground flex justify-between items-center rounded-b-2xl z-50">
            <div className="flex items-center gap-2">
                <div className="bg-tertiary rounded-full p-2">
                    <h1 className="text-lg font-bold cursor-pointer" onClick={handleDadosPerilClick}>Mr. Augusto</h1>
                </div>
            </div>
            <div className="flex gap-3 pr-2">
                <Button variant="ghost" size="icon" className="flex flex-col items-center p-6 bg-tertiary rounded-3xl" onClick={() => setNotificacoesOpen(true)}>
                    <Bell />
                </Button>
                <Notificacoes open={notificacoesOpen} onOpenChange={setNotificacoesOpen} />
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                    onClick={handleSettingsClick}
                >
                    <Settings />
                </Button>
            </div>
        </nav>
    )
}