"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, FileText, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { listarProcessos } from "@/services/processo/processoService";
import { ProcessoDTO } from "@/types/entities/Processo";
import { StatusProcesso, TipoProcesso } from "@/types/enums";

interface ModalBuscaProcessoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessoSelect: (processo: ProcessoDTO) => void;
  clienteId?: number; // Para filtrar processos de um cliente específico
}

export function ModalBuscaProcesso({
  isOpen,
  onOpenChange,
  onProcessoSelect,
  clienteId
}: ModalBuscaProcessoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [processos, setProcessos] = useState<ProcessoDTO[]>([]);
  const [filteredProcessos, setFilteredProcessos] = useState<ProcessoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProcessos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProcessos(processos);
    } else {
      const processosArray = Array.isArray(processos) ? processos : [];
      const filtered = processosArray.filter(processo =>
        processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProcessos(filtered);
    }
  }, [searchTerm, processos]);

  const loadProcessos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const processosData = await listarProcessos();
      let processosArray = Array.isArray(processosData) ? processosData : [];

      // Filtrar por cliente se especificado
      if (clienteId) {
        processosArray = processosArray.filter(processo => processo.cliente?.id === clienteId);
      }

      setProcessos(processosArray);
      setFilteredProcessos(processosArray);
    } catch (err) {
      console.error('Erro ao carregar processos:', err);
      setError('Erro ao carregar lista de processos. Tente novamente.');
      setProcessos([]);
      setFilteredProcessos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessoSelect = (processo: ProcessoDTO) => {
    onProcessoSelect(processo);
    onOpenChange(false);
    setSearchTerm("");
  };

  const getStatusColor = (status: StatusProcesso) => {
    switch (status) {
      case StatusProcesso.EM_ANDAMENTO:
      case StatusProcesso.PROTOCOLADO:
      case StatusProcesso.EM_JULGAMENTO:
        return "bg-green-100 text-green-800";
      case StatusProcesso.PENDENTE:
      case StatusProcesso.EM_ANALISE:
      case StatusProcesso.AGUARDANDO_DADOS:
        return "bg-yellow-100 text-yellow-800";
      case StatusProcesso.CONCLUIDO:
        return "bg-blue-100 text-blue-800";
      case StatusProcesso.REJEITADO:
      case StatusProcesso.ARQUIVADO:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoProcessoLabel = (tipo: TipoProcesso) => {
    switch (tipo) {
      case TipoProcesso.CIVIL:
        return "Civil";
      case TipoProcesso.TRABALHISTA:
        return "Trabalhista";
      case TipoProcesso.PENAL:
        return "Penal";
      case TipoProcesso.FAMILIAR:
        return "Familiar";
      case TipoProcesso.CONSUMIDOR:
        return "Consumidor";
      case TipoProcesso.ADMINISTRATIVO:
        return "Administrativo";
      case TipoProcesso.PREVIDENCIARIO:
        return "Previdenciário";
      case TipoProcesso.OUTROS:
        return "Outros";
      default:
        return "Não definido";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Processo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar por título, descrição, número do processo ou nome do cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Lista de processos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Processos encontrados ({filteredProcessos.length})</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
              >
                Limpar busca
              </Button>
            </div>

            <ScrollArea className="h-64 border rounded-md">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Carregando processos...</div>
                </div>
              ) : filteredProcessos.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2" />
                  <div>Nenhum processo encontrado</div>
                  {searchTerm && (
                    <div className="text-sm">Tente ajustar sua busca</div>
                  )}
                  {clienteId && !searchTerm && (
                    <div className="text-sm">Este cliente não possui processos</div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredProcessos.map((processo) => (
                    <div
                      key={processo.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleProcessoSelect(processo)}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{processo.titulo}</div>
                        {processo.cliente && (
                          <div className="text-sm text-muted-foreground">
                            Cliente: {processo.cliente.nome}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(processo.status)}`}>
                            {processo.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getTipoProcessoLabel(processo.tipoProcesso)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}