/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { AdvogadoLista } from "@/types/entities/Advogado";
import { getMeusAdvogados } from "@/services/cliente/clienteService";

export function ListaAdvogados() {
  const [advogados, setAdvogados] = useState<AdvogadoLista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const loadAdvogados = async () => {
      try {
        setIsLoading(true);
        const data = await getMeusAdvogados();
        setAdvogados(data);
      } catch (error) {
        showError('Erro ao carregar lista de advogados: ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvogados();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando advogados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {advogados.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum advogado vinculado ainda.
        </div>
      ) : (
        advogados.map((advogado) => (
          <Card key={advogado.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{advogado.nome}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {advogado.email}
                    </div>
                    {advogado.telefone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {advogado.telefone}
                      </div>
                    )}
                    {advogado.avaliacao && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{advogado.avaliacao.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {advogado.especialidades && advogado.especialidades.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {advogado.especialidades.map((esp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={advogado.status === "ativo" ? "default" : "secondary"}
                  >
                    {advogado.status === "ativo" ? "Ativo" : advogado.status === "pendente" ? "Pendente" : "Inativo"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}