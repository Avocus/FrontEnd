import { useEffect, useRef, useState } from "react";
import { connect, disconnect, sendMessage as sendWebSocketMessage } from "@/services/chatService";
import axios from "axios";

type Sender = "advogado" | "cliente" | "sistema";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderType: string;
}

interface ChatProps {
  processoId: string;
  isAdvogado: boolean;
}

export default function Chat({ processoId, isAdvogado }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/api/chat/messages/${processoId}`);
        setMessages(response.data as Message[]);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();

    // Connect to WebSocket
    connect(processoId, (receivedMessage) => {
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => {
      disconnect();
    };
  }, [processoId]);

  useEffect(() => {
    // Scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;

    const message = {
      content: text.trim(),
      senderType: isAdvogado ? "advogado" : "cliente",
    };

    sendWebSocketMessage(processoId, message);
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="border rounded-lg p-4"
      style={{
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <h2 className="text-lg font-semibold mb-3">💬 Chat do Processo</h2>

      <div ref={listRef} className="mb-3 max-h-64 overflow-auto space-y-2 px-1">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda. Envie a primeira mensagem.</p>
        )}

        {messages.map((m) => {
          const isMine = m.senderType === (isAdvogado ? "advogado" : "cliente");
          const bubbleStyle: React.CSSProperties = m.senderType === "sistema"
            ? {
                background: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                fontStyle: "italic",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                maxWidth: "80%",
                fontSize: "0.875rem",
              }
            : isMine
            ? {
                background: "hsl(var(--dashboard-emerald))",
                color: "hsl(var(--accent-foreground))",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                maxWidth: "80%",
                fontSize: "0.875rem",
              }
            : {
                background: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                maxWidth: "80%",
                fontSize: "0.875rem",
              };

          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div style={bubbleStyle}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: 'right' }}>{new Date(m.createdAt).toLocaleString('pt-BR')}</div>
              </div>
            </div>
          );
        })}
      </div>

        <div className="flex gap-2 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAdvogado ? "Escreva uma mensagem como advogado..." : "Escreva uma mensagem para seu advogado..."}
            className="flex-1 min-h-[44px] max-h-36 resize-y rounded-md border px-2 py-2 text-sm"
            style={{ background: "hsl(var(--input))", color: "hsl(var(--card-foreground))", borderColor: "hsl(var(--border))" }}
          />

          <div className="flex flex-col">
            <button
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium"
              style={{ background: "hsl(var(--dashboard-emerald))", color: "hsl(var(--accent-foreground))" }}
            >
              Enviar
            </button>
          </div>
        </div>
    </div>
  );
}
