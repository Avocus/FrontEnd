import React, { useEffect, useRef } from 'react';
import { Mensagem } from '@/hooks/useMensagens';

interface MensagemListProps {
  mensagens: Mensagem[];
  currentUserId?: string | number;
  currentUserName?: string;
  isAdvogado?: boolean;
}

const MensagemList: React.FC<MensagemListProps> = ({ mensagens, currentUserId, currentUserName, isAdvogado }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  return (
    <div
      className="space-y-3 mb-2 max-h-96 overflow-y-auto chat-messages px-1"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
    >
      {mensagens.map((msg, index) => {
        const fromAdvogado = Boolean(msg.advogadoNome);

        // Determine ownership: prefer name comparison, fallback to id comparison
        const senderName = fromAdvogado ? msg.advogadoNome : msg.clienteNome;

        const isMine = (() => {
          if (currentUserName) {
            try {
              const a = String(currentUserName).trim().toLowerCase();
              const b = String(senderName || '').trim().toLowerCase();
              if (a && b && a === b) return true;
            } catch (e) {
              console.error('Erro ao comparar nomes:', e); 
            }
          }

          if (currentUserId) {
            const uid = String(currentUserId);
            if (isAdvogado) {
              return Boolean(msg.advogadoId) && String(msg.advogadoId) === uid;
            }
            return Boolean(msg.clienteId) && String(msg.clienteId) === uid;
          }

          return false;
        })();

        const bubbleStyle: React.CSSProperties = isMine
          ? {
              background: 'hsl(var(--secondary))',
              color: 'hsl(var(--accent-foreground))',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              maxWidth: '80%',
              fontSize: '0.95rem',
            }
          : {
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              maxWidth: '80%',
              fontSize: '0.95rem',
            };

        return (
          <div key={msg.id || `msg-${index}`} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div style={bubbleStyle}>
              <div className="text-sm font-medium mb-1">
                {senderName}
              </div>
              <div className="whitespace-pre-wrap">{msg.conteudo}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: 'right' }}>{msg.dataHora ? new Date(msg.dataHora).toLocaleString('pt-BR') : ''}</div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MensagemList;