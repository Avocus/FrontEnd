/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Scale, Loader2, Search, Star } from "lucide-react";
import { AdvogadoLista } from "@/types/entities/Advogado";
import { getMeusAdvogados } from "@/services/cliente/clienteService";
import { useToast } from "@/hooks/useToast";
import { getEspecialidadeLabel } from '../../types/enums';

export function ListaAdvogados() {
  const [advogados, setAdvogados] = useState<AdvogadoLista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { error: showError } = useToast();

  useEffect(() => {
    const loadAdvogados = async () => {
      try {
        setIsLoading(true);
        const data = await getMeusAdvogados();
        setAdvogados(data);
        console.log(data);
      } catch (error) {
        showError("Erro ao carregar lista de advogados: " + error);
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

  const filteredAdvogados = advogados.filter((adv) =>
    adv.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Input de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar advogados por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredAdvogados.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {advogados.length === 0
            ? "Nenhum advogado vinculado ainda."
            : "Nenhum advogado encontrado."}
        </div>
      ) : (
        filteredAdvogados.map((advogado) => (
          <Card key={advogado.id}>
            <CardContent
              className="p-6"
              onClick={() => abrirModalDetalhes(advogado)}
            >
              <div className="flex justify-between items-start">
                
                {/* Informações principais */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2" >
                    <h3 className="text-lg font-semibold">{advogado.nome}</h3>
                    {advogado.oab && (
                      <div className="flex items-center gap-2 text-sm pt-1 text-muted-foreground">
                        -
                        <Scale className="h-4 w-4" />
                        OAB: {advogado.oab}
                      </div>
                    )}
                  </div>

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
                  </div>

                  {/* Especialidades */}
                  {advogado.especialidades && advogado.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {advogado.especialidades.map((esp, index) => (
                        <Badge key={index} variant="outline">
                          {getEspecialidadeLabel(esp)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// Será implementado depois com modal real
function abrirModalDetalhes(advogado: AdvogadoLista) {
  console.log("Abrir modal:", advogado);
}
