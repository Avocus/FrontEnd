"use client";
import { Home, User, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatAvocuss } from "./chatAvocuss"; // Importação do ChatAvocuss

export function FooterMobile() {
    const [chatOpen, setChatOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!router) {
            console.error('NextRouter não foi montado.');
        }
    }, [router]);

    const handleHomeClick = () => {
        if (router) {
            router.push('/home');
        }
    };


    return (
        <footer className="w-full fixed bottom-0 bg-secondary text-secondary-foreground flex justify-around p-2 rounded-t-xl">
            <Button 
                variant="ghost" 
                className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                onClick={() => setChatOpen(true)}
            >
                <MessageCircle className="w-8 h-8 text-secondary-foreground " />
                <span className="text-xs text-secondary-foreground">Chat</span>
            </Button>
            <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
            <Button 
                variant="ghost" 
                className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                onClick={handleHomeClick}  // Adiciona a navegação para a rota home
            >
                <Home className="w-8 h-8 text-secondary-foreground" />
                <span className="text-xs text-secondary-foreground">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center p-6 bg-tertiary rounded-3xl">
                <User className="w-8 h-8 text-secondary-foreground" />
                <span className="text-xs text-secondary-foreground">Casos</span>
            </Button>
        </footer>
    );
}