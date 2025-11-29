"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMeusAdvogados } from "@/services/cliente/clienteService";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";

interface AdvogadoLista {
  id: string;
  nome: string;
  email: string;
  especialidades?: string[];
  experiencia?: string;
}

interface ModalBuscaAdvogadoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdvogadoSelect: (advogado: AdvogadoLista) => void;
}

export function ModalBuscaAdvogado({
  isOpen,
  onOpenChange,
  onAdvogadoSelect
}: ModalBuscaAdvogadoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [advogados, setAdvogados] = useState<AdvogadoLista[]>([]);
  const [filteredAdvogados, setFilteredAdvogados] = useState<AdvogadoLista[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadAdvogados();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAdvogados(advogados);
    } else {
      const filtered = advogados.filter(advogado =>
        advogado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advogado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (advogado.especialidades && advogado.especialidades.some(esp =>
          esp.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredAdvogados(filtered);
    }
  }, [searchTerm, advogados]);

  const loadAdvogados = async () => {
    setIsLoading(true);
    try {
      const data = await getMeusAdvogados();
      const advogadosFormatados = data.map(adv => ({
        id: adv.id,
        nome: adv.nome,
        email: adv.email,
        especialidades: adv.especialidades,
        experiencia: undefined // O DTO não tem esse campo, pode remover se não for necessário
      }));
      setAdvogados(advogadosFormatados);
      setFilteredAdvogados(advogadosFormatados);
    } catch (error) {
      showError('Erro ao carregar advogados: ' + error);
      console.error('Erro ao carregar advogados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvogadoSelect = (advogado: AdvogadoLista) => {
    onAdvogadoSelect(advogado);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Buscar Advogado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por nome, email ou especialidade</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de advogados */}
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando advogados...</p>
              </div>
            ) : filteredAdvogados.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Nenhum advogado encontrado" : "Nenhum advogado disponível"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAdvogados.map((advogado) => (
                  <div
                    key={advogado.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleAdvogadoSelect(advogado)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{advogado.nome}</div>
                        <div className="text-sm text-muted-foreground">{advogado.email}</div>
                        {advogado.especialidades && advogado.especialidades.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {advogado.especialidades.map((esp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {esp}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}