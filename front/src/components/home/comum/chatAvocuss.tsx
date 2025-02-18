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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatAvocuss({ open, onOpenChange }: ChatAvocussProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (open) {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } else {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const botResponse = await getBotResponse(input);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-secondary text-secondary-foreground">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg">Chat com Sr. Avocuss</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-64 border rounded-md p-3 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs mt-2 mb-2 ${msg.sender === "user" ? "bg-tertiary" : "bg-quaternary"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            className="flex-1 bg-secondary text-secondary-foreground"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
