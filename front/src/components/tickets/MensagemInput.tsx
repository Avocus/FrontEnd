'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MensagemInputProps {
  onSend: (conteudo: string) => void;
  disabled?: boolean;
}

const MensagemInput: React.FC<MensagemInputProps> = ({ onSend, disabled }) => {
  const [conteudo, setConteudo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conteudo.trim()) {
      onSend(conteudo.trim());
      setConteudo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !conteudo.trim()}>
        Enviar
      </Button>
    </form>
  );
};

export default MensagemInput;