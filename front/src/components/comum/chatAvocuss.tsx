"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
if (!apiKey) {
  throw new Error("API key is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatAvocussProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function ChatAvocuss({ open, onOpenChange, onClose }: ChatAvocussProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Olá! Sou a Avocuss, assistente virtual da plataforma. Como posso ajudar você hoje?",
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setDialogOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    
    if (!newOpen && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } else {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [open, messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { sender: "user", text: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage("");

    const botResponse = await getBotResponse(inputMessage);
    setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
  };

  const getBotResponse = async (msg: string) => {
    const chatSession = model.startChat({
      generationConfig,
      history: messages.map((message) => ({
        role: message.sender === "user" ? "user" : "model",
        parts: [{ text: message.text }],
      })),
    });

    const result = await chatSession.sendMessage(msg);
    return result.response.text();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md bg-primary text-secondary-foreground rounded-2xl p-4">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg font-bold">Chat com Sr. Avocuss</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-72 border border-border rounded-lg p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-tertiary text-tertiary-foreground"
                    : "bg-quaternary text-quaternary-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex items-center gap-2 mt-4">
          <Input
            className="flex-1 bg-primary text-secondary-foreground border-border rounded-lg shadow-sm focus:ring focus:ring-ring focus:border-border"
            placeholder="Digite sua mensagem..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            className="bg-primary text-secondary-foreground rounded-lg shadow-md hover:bg-primary-hover flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <Send size={20} className="mr-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

