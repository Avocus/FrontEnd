"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Loader2, Search, Star } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export interface EntityItem {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  status: string;
  especialidades?: string[];
  avaliacao?: number;
}

export interface ListaEntidadeProps<T extends EntityItem> {
  loadFunction: () => Promise<T[]>;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  onDetailsClick?: (item: T) => void;
  detailsButtonText?: string;
}

function ListaEntidadeComponent<T extends EntityItem>({
  loadFunction,
  hasSearch = false,
  searchPlaceholder = "Buscar...",
  onDetailsClick,
  detailsButtonText = "Ver Detalhes"
}: ListaEntidadeProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { error: showError } = useToast();

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await loadFunction();
        setItems(data);
      } catch (error) {
        showError('Erro ao carregar lista: ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [loadFunction]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  const filteredItems = hasSearch
    ? items.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-4">
      {hasSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {items.length === 0 ? "Nenhum item cadastrado ainda." : "Nenhum item encontrado."}
        </div>
      ) : (
        filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.nome}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {item.email}
                    </div>
                    {item.telefone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {item.telefone}
                      </div>
                    )}
                    {'avaliacao' in item && item.avaliacao && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.avaliacao.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {'especialidades' in item && item.especialidades && item.especialidades.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.especialidades.map((esp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={item.status === "ativo" ? "default" : "secondary"}
                  >
                    {item.status === "ativo" ? "Ativo" : item.status === "pendente" ? "Pendente" : "Inativo"}
                  </Badge>
                  {onDetailsClick && (
                    <Button variant="outline" size="sm" onClick={() => onDetailsClick(item)}>
                      {detailsButtonText}
                    </Button>
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

export const ListaEntidade = React.memo(ListaEntidadeComponent) as <T extends EntityItem>(
  props: ListaEntidadeProps<T>
) => React.ReactElement;