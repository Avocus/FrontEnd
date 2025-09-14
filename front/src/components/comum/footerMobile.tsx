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

    function handleHomeClick(): void {
        if (router) {
            router.push("/");
        } else {
            console.error('Router não está disponível.');
        }
    }

    function handleCasosClick(): void {
        if (router) {
            router.push("/casos");
        } else {
            console.error('Router não está disponível.');
        }
    }

    return (
        <footer className="w-full fixed bottom-0 left-0 bg-tertiary text-secondary-foreground flex justify-around p-2">
            <Button 
                variant="ghost" 
                className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                onClick={() => setChatOpen(true)}
            >
                <MessageCircle className="w-8 h-8 text-secondary-foreground " />
                <span className="text-xs text-secondary-foreground">Chatbot</span>
            </Button>
            <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
            <Button 
                variant="ghost" 
                className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                onClick={handleHomeClick}
            >
                <Home className="w-8 h-8 text-secondary-foreground" />
                <span className="text-xs text-secondary-foreground">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                onClick={handleCasosClick}
            >
                <User className="w-8 h-8 text-secondary-foreground" />
                <span className="text-xs text-secondary-foreground">Casos</span>
            </Button>
        </footer>
    );
}