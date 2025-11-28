import React from 'react';
import { Mensagem } from '@/hooks/useMensagens';
import { Card } from '@/components/ui/card';

interface MensagemListProps {
  mensagens: Mensagem[];
}

const MensagemList: React.FC<MensagemListProps> = ({ mensagens }) => {
  return (
    <div 
      className="space-y-4 mb-4 max-h-96 overflow-y-scroll chat-messages" 
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}
    >
      {mensagens.map((msg) => (
        <Card key={msg.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {msg.clienteNome || msg.advogadoNome}
              </p>
              <p className="text-sm text-gray-600">{msg.conteudo}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(msg.dataHora).toLocaleString()}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MensagemList;