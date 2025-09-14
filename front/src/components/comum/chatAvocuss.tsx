"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Scale, AlertCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  identifyCaseType, 
  generateLegalPrompt,
  isLegalContext,
  type LegalCase
} from "@/lib/legal-ai-config";
import { searchLegalArticle, searchJurisprudence, extendedLegalKnowledge } from "@/lib/legal-knowledge-base";

const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
if (!apiKey) {
  throw new Error("API key is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 0.3, // Reduzido para respostas mais precisas em contexto jurídico
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface Message {
  sender: "user" | "bot";
  text: string;
  caseType?: LegalCase['type'];
  legalReferences?: string[];
  timestamp?: Date | string;
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
      text: "⚖️ Olá! Sou a Avocuss, assistente jurídica especializada em direito brasileiro. Faça sua pergunta jurídica e receba orientações rápidas e práticas!",
      timestamp: new Date(),
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(open || false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Função para fazer scroll para o final
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

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
      const savedMessages = localStorage.getItem("avocussLegalChatHistory");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Converte timestamps de string para Date se necessário
          const messagesWithDates = parsedMessages.map((msg: Message) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error("Erro ao carregar histórico do chat:", error);
          // Se houver erro, usa mensagem padrão
          setMessages([{
            sender: "bot",
            text: "⚖️ Olá! Sou a Avocuss, assistente jurídica especializada em direito brasileiro. Faça sua pergunta jurídica e receba orientações rápidas e práticas!",
            timestamp: new Date(),
          }]);
        }
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      localStorage.setItem("avocussLegalChatHistory", JSON.stringify(messages));
    }
  }, [open, messages]);

  // Scroll para o final quando o dialog abrir
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Pequeno delay para garantir que o DOM foi renderizado
    }
  }, [dialogOpen]);

  // Scroll para o final quando novas mensagens forem adicionadas
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages]);

  const getCaseTypeColor = (caseType: LegalCase['type']) => {
    const colors = {
      civil: "bg-blue-100 text-blue-800",
      penal: "bg-red-100 text-red-800", 
      trabalhista: "bg-green-100 text-green-800",
      tributario: "bg-yellow-100 text-yellow-800",
      familia: "bg-pink-100 text-pink-800",
      constitucional: "bg-purple-100 text-purple-800",
      administrativo: "bg-orange-100 text-orange-800",
      consumidor: "bg-cyan-100 text-cyan-800"
    };
    return colors[caseType] || "bg-gray-100 text-gray-800";
  };

  const getCaseTypeLabel = (caseType: LegalCase['type']) => {
    const labels = {
      civil: "Direito Civil",
      penal: "Direito Penal",
      trabalhista: "Direito Trabalhista", 
      tributario: "Direito Tributário",
      familia: "Direito de Família",
      constitucional: "Direito Constitucional",
      administrativo: "Direito Administrativo",
      consumidor: "Direito do Consumidor"
    };
    return labels[caseType] || "Direito Geral";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Verifica se a pergunta é relacionada ao contexto jurídico
    if (!isLegalContext(inputMessage)) {
      const nonLegalMessage: Message = {
        sender: "bot",
        text: "🚫 Desculpe, sou especializada apenas em questões jurídicas. Por favor, faça uma pergunta relacionada ao direito brasileiro (civil, penal, trabalhista, etc.).",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, { 
        sender: "user", 
        text: inputMessage,
        timestamp: new Date()
      }, nonLegalMessage]);
      setInputMessage("");
      return;
    }

    // Identifica o tipo de caso jurídico
    const caseType = identifyCaseType(inputMessage);
    
    // Busca referências legais relevantes
    const legalReferences = searchLegalArticle(inputMessage);
    
    const userMessage: Message = { 
      sender: "user", 
      text: inputMessage,
      caseType,
      legalReferences,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const botResponse = await getBotResponse(inputMessage, caseType);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: botResponse,
        caseType,
        timestamp: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "❌ Erro ao processar sua consulta jurídica. Tente reformular sua pergunta ou entre em contato com o suporte.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = async (msg: string, caseType: LegalCase['type']) => {
    // Gera o prompt especializado baseado no tipo de caso (agora mais conciso)
    const specializedPrompt = generateLegalPrompt(caseType, msg);
    
    // Busca jurisprudências relevantes (limitando para respostas mais concisas)
    const relevantJurisprudence = searchJurisprudence(caseType);
    
    // Adiciona contexto mais enxuto da base de conhecimento
    let extendedContext = '';
    
    // Adiciona apenas 1-2 artigos mais relevantes por área
    if (caseType === 'civil' && extendedLegalKnowledge.codigoCivilCompleto) {
      Object.entries(extendedLegalKnowledge.codigoCivilCompleto.obrigacoes || {}).forEach(([, value]) => {
        if ((msg.toLowerCase().includes('obrigação') || msg.toLowerCase().includes('contrato')) && extendedContext.length < 200) {
          extendedContext += `${value}\n`;
        }
      });
    }
    
    if (caseType === 'penal' && extendedLegalKnowledge.codigoPenalCompleto) {
      Object.entries(extendedLegalKnowledge.codigoPenalCompleto.crimesContraPatrimonio || {}).forEach(([, value]) => {
        if ((msg.toLowerCase().includes('furto') || msg.toLowerCase().includes('roubo')) && extendedContext.length < 200) {
          extendedContext += `${value}\n`;
        }
      });
    }
    
    if (caseType === 'trabalhista' && extendedLegalKnowledge.cltCompleta) {
      Object.entries(extendedLegalKnowledge.cltCompleta.contratoTrabalho || {}).forEach(([, value]) => {
        if ((msg.toLowerCase().includes('demissão') || msg.toLowerCase().includes('empregado')) && extendedContext.length < 200) {
          extendedContext += `${value}\n`;
        }
      });
    }
    
    if (caseType === 'consumidor' && extendedLegalKnowledge.cdcCompleto) {
      Object.entries(extendedLegalKnowledge.cdcCompleto.direitosBasicos || {}).forEach(([, value]) => {
        if ((msg.toLowerCase().includes('produto') || msg.toLowerCase().includes('consumidor')) && extendedContext.length < 200) {
          extendedContext += `${value}\n`;
        }
      });
    }
    
    // Adiciona apenas 1 jurisprudência mais relevante
    const jurisprudenceContext = relevantJurisprudence.length > 0 
      ? `\n\nJURISPRUDÊNCIA: ${relevantJurisprudence[0].sumula || relevantJurisprudence[0].tema}: ${relevantJurisprudence[0].texto.substring(0, 150)}...`
      : '';

    // Prompt final mais enxuto
    const enhancedPrompt = specializedPrompt + (extendedContext ? `\n\nLEGISLAÇÃO: ${extendedContext.substring(0, 300)}` : '') + jurisprudenceContext;

    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 500, // Limitando para respostas mais curtas
        temperature: 0.2 // Mais conservador para respostas diretas
      },
      history: messages.slice(-6).map((message) => ({ // Reduzindo histórico para respostas mais focadas
        role: message.sender === "user" ? "user" : "model",
        parts: [{ text: message.text }],
      })),
    });

    const result = await chatSession.sendMessage(enhancedPrompt);
    return result.response.text();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md md:max-w-2xl lg:max-w-4xl bg-primary text-secondary-foreground rounded-2xl p-4 md:p-6">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Scale className="w-5 h-5 md:w-6 md:h-6" />
            Avocuss - Assistente Jurídica
          </DialogTitle>
        </DialogHeader>

        <ScrollArea 
          ref={scrollAreaRef}
          className="h-72 md:h-96 lg:h-[500px] border border-border rounded-lg p-4 space-y-3"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} mb-4`}
            >
              {/* Badge de categoria jurídica */}
              {msg.caseType && msg.sender === "user" && (
                <Badge className={`mb-1 text-xs ${getCaseTypeColor(msg.caseType)}`}>
                  {getCaseTypeLabel(msg.caseType)}
                </Badge>
              )}
              
              <div
                className={`px-4 py-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-tertiary text-tertiary-foreground"
                    : "bg-quaternary text-quaternary-foreground"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="space-y-3">
                    {/* Resposta principal */}
                    <div className="leading-relaxed font-medium">
                      {(() => {
                        const parts = msg.text.split(/(?=Art\.\s+\d+)|(?=\*Esta orientação)/);
                        const mainResponse = parts[0]?.trim();
                        const articlePart = parts.find(part => part.includes('Art.'))?.trim();
                        const disclaimer = parts.find(part => part.includes('*Esta orientação'))?.trim();
                        
                        return (
                          <>
                            {/* Resposta direta */}
                            <div className="text-base leading-snug">
                              {mainResponse}
                            </div>
                            
                            {/* Artigo legal */}
                            {articlePart && (
                              <div className="mt-3 pt-2 border-t border-border/20">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1 h-1 bg-current rounded-full opacity-50"></div>
                                  <span className="text-xs uppercase tracking-wide opacity-60 font-semibold">
                                    Legislação
                                  </span>
                                </div>
                                <div className="text-xs bg-background/10 px-3 py-2 rounded border-l-2 border-current/30">
                                  {articlePart}
                                </div>
                              </div>
                            )}
                            
                            {/* Disclaimer */}
                            {disclaimer && (
                              <div className="mt-3 pt-2 border-t border-border/20">
                                <div className="flex items-start gap-2 text-xs opacity-70">
                                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span className="italic leading-tight">
                                    {disclaimer.replace(/\*/g, '')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>

              {/* Referências legais */}
              {msg.legalReferences && msg.legalReferences.length > 0 && (
                <div className="mt-2 max-w-xs md:max-w-md lg:max-w-lg">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <BookOpen className="w-3 h-3" />
                    Referências encontradas:
                  </div>
                  {msg.legalReferences.slice(0, 2).map((ref, i) => (
                    <div key={i} className="text-xs bg-muted p-1 rounded text-muted-foreground mb-1">
                      {ref.length > 80 ? `${ref.substring(0, 80)}...` : ref}
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              {msg.timestamp && (
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          ))}
          
          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-quaternary text-quaternary-foreground px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="ml-2">Analisando sua consulta jurídica...</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center gap-2 mt-4">
          <Input
            className="flex-1 bg-primary text-secondary-foreground border-border rounded-lg shadow-sm focus:ring focus:ring-ring focus:border-border"
            placeholder="Digite sua consulta jurídica..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSendMessage()}
            disabled={isTyping}
          />
          <Button
            className="bg-primary text-secondary-foreground rounded-lg shadow-md hover:bg-primary-hover flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={isTyping || !inputMessage.trim()}
          >
            <Send size={20} className="mr-1" />
          </Button>
        </div>

        {/* Aviso legal */}
        <div className="mt-2 text-xs text-muted-foreground flex items-start gap-1">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            As orientações fornecidas têm caráter informativo e não substituem consulta presencial com advogado.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

