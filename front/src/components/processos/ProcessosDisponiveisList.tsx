'use client'

import React, { useEffect } from 'react';
import { useProcessosDisponiveis, ProcessoDisponivel } from '@/hooks/useProcessosDisponiveis';
import { Card, CardContent } from '@/components/ui/card';
import ProcessoDisponivelCard from './ProcessoDisponivelCard';

const ProcessosDisponiveisList: React.FC = () => {
  const { processos, fetchProcessosDisponiveis, assignProcesso, isLoading } = useProcessosDisponiveis();

  useEffect(() => {
    fetchProcessosDisponiveis();
  }, []);

  const handlePegarCaso = async (processoId: string) => {
    try {
      await assignProcesso(processoId);
    } catch (error) {
      console.error('Erro ao pegar processo:', error);
    }
  };

  if (isLoading && processos.length === 0) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Processos Disponíveis</h1>
      {processos.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              Nenhum processo disponível no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {processos.map((processo: ProcessoDisponivel) => (
            <ProcessoDisponivelCard
              key={processo.id}
              processo={processo}
              onPegarCaso={handlePegarCaso}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessosDisponiveisList;