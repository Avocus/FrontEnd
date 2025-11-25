import { useEffect, useRef, useState } from "react";

type Sender = "advogado" | "cliente" | "sistema";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
  attachments?: MessageAttachment[];
}

interface ChatProps {
  processoId: string;
  isAdvogado: boolean;
}

interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // base64 data URL
}

export default function Chat({ processoId, isAdvogado }: ChatProps) {
  const storageKey = `chat_${processoId}`;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMessages(JSON.parse(raw));
    } catch (e) {
      console.error("Falha ao carregar chat:", e);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error("Falha ao salvar chat:", e);
    }
    // scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, storageKey]);

  function sendMessage() {
    // don't send empty message unless there is an attachment
    if (!text.trim() && selectedFiles.length === 0) return;

    const readFileAsDataUrl = (file: File) =>
      new Promise<MessageAttachment>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: reader.result as string,
          });
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

    Promise.all(selectedFiles.map((f) => readFileAsDataUrl(f)))
      .then((attachments) => {
        const m: Message = {
          id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          sender: isAdvogado ? "advogado" : "cliente",
          text: text.trim(),
          createdAt: new Date().toISOString(),
          attachments: attachments.length ? attachments : undefined,
        };
        setMessages((s) => [...s, m]);
        setText("");
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      })
      .catch((err) => {
        console.error("Erro lendo anexos:", err);
        alert("Falha ao ler um dos anexos. Tente novamente.");
      });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const arr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > maxSize) {
        alert(`O arquivo ${f.name} é maior que 5MB e não será anexado.`);
        continue;
      }
      arr.push(f);
    }
    setSelectedFiles((s) => [...s, ...arr].slice(0, 5)); // limite de 5 arquivos selecionados
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((s) => s.filter((_, i) => i !== index));
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
          const isMine = m.sender === (isAdvogado ? "advogado" : "cliente");
          const bubbleStyle: React.CSSProperties = m.sender === "sistema"
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
                <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.attachments.map((att) => (
                        <div key={att.id} className="mt-1">
                          {att.type.startsWith('image/') ? (
                            <img src={att.dataUrl} alt={att.name} className="rounded-md max-w-full" />
                          ) : att.type.startsWith('video/') ? (
                            <video src={att.dataUrl} controls className="rounded-md max-w-full" />
                          ) : (
                            <div className="mt-1 flex items-center gap-3 p-2 border rounded-md" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--muted))', borderRadius: 6 }}>
                                {/* simple file icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <a href={att.dataUrl} download={att.name} className="text-sm font-medium block truncate" style={{ color: 'hsl(var(--foreground))' }}>{att.name}</a>
                                <div className="text-xs opacity-70">{formatBytes(att.size)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: 'right' }}>{new Date(m.createdAt).toLocaleString('pt-BR')}</div>
              </div>
            </div>
          );
        })}
      </div>

        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center gap-2 border rounded px-2 py-1" style={{ background: 'hsl(var(--muted))' }}>
                <div className="text-sm">{f.name}</div>
                <button onClick={() => removeSelectedFile(i)} className="text-sm text-muted-foreground underline">Remover</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              id={`chat-file-${processoId}`}
            />
            <label htmlFor={`chat-file-${processoId}`} className="inline-flex items-center px-3 py-2 rounded-md text-sm cursor-pointer" style={{ background: 'transparent', color: 'hsl(var(--dashboard-emerald))' }}>
              Anexar
            </label>
          </div>

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
