'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TipoProcesso, getTipoProcessoLabel, StatusProcesso, getStatusProcessoLabel } from '@/types/enums';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProcessoDisponivel } from '@/hooks/useProcessosDisponiveis';
import { getUrgenciaLabel } from '@/lib/urgency';

interface ProcessoDisponivelCardProps {
  processo: ProcessoDisponivel;
  onPegarCaso: (processoId: string) => void;
  isLoading: boolean;
}

const ProcessoDisponivelCard: React.FC<ProcessoDisponivelCardProps> = ({
  processo,
  onPegarCaso,
  isLoading
}) => {
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'ALTA': return 'bg-red-100 text-red-800';
      case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
      case 'BAIXA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{processo.titulo}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getTipoProcessoLabel(processo.tipoProcesso as TipoProcesso)}
              </Badge>
              <Badge className={getUrgenciaColor(processo.urgencia)}>
                {getUrgenciaLabel(processo.urgencia)}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{format(new Date(processo.dataAbertura), 'dd/MM/yyyy', { locale: ptBR })}</p>
            <p>Cliente: {processo.clienteNome}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{processo.descricao}</p>
        <div className="flex justify-end gap-2">
          <Link
            href={`/processos/${processo.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver Detalhes
          </Link>
          <Button
            onClick={() => onPegarCaso(processo.id.toString())}
            disabled={isLoading}
            variant={"primary"}
          >
            {isLoading ? 'Atribuindo...' : 'Pegar Caso'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessoDisponivelCard;