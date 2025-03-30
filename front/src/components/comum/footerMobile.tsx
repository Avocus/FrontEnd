"use client";
import { Home, User, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
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
            <Link href="/home" className="flex flex-col items-center">
                <Button 
                    variant="ghost" 
                    className="flex flex-col items-center p-6 bg-tertiary rounded-3xl"
                >
                    <Home className="w-8 h-8 text-secondary-foreground" />
                    <span className="text-xs text-secondary-foreground">Home</span>
                </Button>
            </Link>
            <Link href="/casos" className="flex flex-col items-center">
                <Button variant="ghost" className="flex flex-col items-center p-6 bg-tertiary rounded-3xl">
                    <User className="w-8 h-8 text-secondary-foreground" />
                    <span className="text-xs text-secondary-foreground">Casos</span>
                </Button>
            </Link>
        </footer>
    );
}