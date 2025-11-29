import { ProcessoCliente, ProcessoAdvogado, TimelineEntry } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";
import React from "react";
import { 
  Clock, 
  Pause, 
  Search, 
  Check, 
  X, 
  FileText, 
  Send, 
  FileCheck, 
  Play, 
  Gavel, 
  CheckCircle2, 
  Archive, 
  HelpCircle 
} from "lucide-react";

// Função utilitária para obter label do status
export const getStatusLabel = (status: string, isAdvogado: boolean = false) => {
  if (isAdvogado) {
    const labels: Record<string, string> = {
      [StatusProcesso.RASCUNHO]: "Rascunho",
      [StatusProcesso.PENDENTE]: "Pendente",
      [StatusProcesso.EM_ANALISE]: "Em Análise",
      [StatusProcesso.ACEITO]: "Aceito",
      [StatusProcesso.REJEITADO]: "Rejeitado",
      [StatusProcesso.AGUARDANDO_DADOS]: "Aguardando Documentos",
      [StatusProcesso.DADOS_ENVIADOS]: "Documentos Enviados",
      [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: "Aguardando Análise de Documentos",
      [StatusProcesso.EM_ANDAMENTO]: "Em Andamento",
      [StatusProcesso.PROTOCOLADO]: "Protocolado",
      [StatusProcesso.EM_JULGAMENTO]: "Em Julgamento",
      [StatusProcesso.CONCLUIDO]: "Concluído",
      [StatusProcesso.ARQUIVADO]: "Arquivado"
    };
    return labels[status] || status;
  } else {
    const labels: Record<string, string> = {
      [StatusProcesso.RASCUNHO]: "Rascunho",
      [StatusProcesso.EM_ANDAMENTO]: "Em Andamento",
      [StatusProcesso.AGUARDANDO_DADOS]: "Aguardando Documentos",
      [StatusProcesso.EM_JULGAMENTO]: "Em Julgamento",
      [StatusProcesso.CONCLUIDO]: "Concluído",
      [StatusProcesso.ARQUIVADO]: "Arquivado"
    };
    return labels[status] || status;
  }
};

// Função utilitária para obter variante do badge de status
export const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    [StatusProcesso.RASCUNHO]: "outline",
    [StatusProcesso.PENDENTE]: "secondary",
    [StatusProcesso.EM_ANALISE]: "default",
    [StatusProcesso.ACEITO]: "default",
    [StatusProcesso.REJEITADO]: "destructive",
    [StatusProcesso.AGUARDANDO_DADOS]: "secondary",
    [StatusProcesso.DADOS_ENVIADOS]: "default",
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: "default",
    [StatusProcesso.EM_ANDAMENTO]: "secondary",
    [StatusProcesso.PROTOCOLADO]: "default",
    [StatusProcesso.EM_JULGAMENTO]: "secondary",
    [StatusProcesso.CONCLUIDO]: "outline",
    [StatusProcesso.ARQUIVADO]: "destructive"
  };
  return variants[status] || "outline";
};

// Função utilitária para obter cor do status
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    [StatusProcesso.RASCUNHO]: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    [StatusProcesso.PENDENTE]: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
    [StatusProcesso.EM_ANALISE]: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
    [StatusProcesso.ACEITO]: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    [StatusProcesso.REJEITADO]: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    [StatusProcesso.AGUARDANDO_DADOS]: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700",
    [StatusProcesso.DADOS_ENVIADOS]: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700",
    [StatusProcesso.EM_ANDAMENTO]: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-700",
    [StatusProcesso.PROTOCOLADO]: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-700",
    [StatusProcesso.EM_JULGAMENTO]: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700",
    [StatusProcesso.CONCLUIDO]: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700",
    [StatusProcesso.ARQUIVADO]: "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600"
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
};

// Função utilitária para obter ícone do status
export const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactElement> = {
    [StatusProcesso.RASCUNHO]: React.createElement(Clock, { className: "h-3 w-3" }),
    [StatusProcesso.PENDENTE]: React.createElement(Pause, { className: "h-3 w-3" }),
    [StatusProcesso.EM_ANALISE]: React.createElement(Search, { className: "h-3 w-3" }),
    [StatusProcesso.ACEITO]: React.createElement(Check, { className: "h-3 w-3" }),
    [StatusProcesso.REJEITADO]: React.createElement(X, { className: "h-3 w-3" }),
    [StatusProcesso.AGUARDANDO_DADOS]: React.createElement(FileText, { className: "h-3 w-3" }),
    [StatusProcesso.DADOS_ENVIADOS]: React.createElement(Send, { className: "h-3 w-3" }),
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: React.createElement(FileCheck, { className: "h-3 w-3" }),
    [StatusProcesso.EM_ANDAMENTO]: React.createElement(Play, { className: "h-3 w-3" }),
    [StatusProcesso.PROTOCOLADO]: React.createElement(FileText, { className: "h-3 w-3" }),
    [StatusProcesso.EM_JULGAMENTO]: React.createElement(Gavel, { className: "h-3 w-3" }),
    [StatusProcesso.CONCLUIDO]: React.createElement(CheckCircle2, { className: "h-3 w-3" }),
    [StatusProcesso.ARQUIVADO]: React.createElement(Archive, { className: "h-3 w-3" })
  };
  return icons[status] || React.createElement(HelpCircle, { className: "h-3 w-3" });
};

// Função utilitária para obter cor da coluna do kanban
export const getColumnColor = (status: string) => {
  const colors: Record<string, string> = {
    [StatusProcesso.RASCUNHO]: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
    [StatusProcesso.PENDENTE]: "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700",
    [StatusProcesso.EM_ANALISE]: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
    [StatusProcesso.ACEITO]: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    [StatusProcesso.REJEITADO]: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    [StatusProcesso.AGUARDANDO_DADOS]: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
    [StatusProcesso.DADOS_ENVIADOS]: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800",
    [StatusProcesso.EM_ANDAMENTO]: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800",
    [StatusProcesso.PROTOCOLADO]: "bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800",
    [StatusProcesso.EM_JULGAMENTO]: "bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800",
    [StatusProcesso.CONCLUIDO]: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
    [StatusProcesso.ARQUIVADO]: "bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-700"
  };
  return colors[status] || "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700";
};

// Função utilitária para adicionar entrada no timeline
export const addTimelineEntry = (
  statusAnterior: StatusProcesso | undefined,
  novoStatus: StatusProcesso,
  descricao: string,
  autor: "cliente" | "advogado" | "sistema",
  observacoes?: string
): TimelineEntry => {
  return {
    id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    data: new Date().toISOString(),
    statusAnterior,
    novoStatus,
    descricao,
    autor,
    observacoes
  };
};

// Função utilitária para verificar se cliente pode modificar documentos
export const podeModificarDocumentos = (status: StatusProcesso, isAdvogado: boolean) => {
  if (isAdvogado) return false; // Advogados não modificam documentos aqui
  // Cliente pode modificar documentos apenas em determinados status
  const statusPermitidos = [
    StatusProcesso.RASCUNHO,
    StatusProcesso.AGUARDANDO_DADOS
  ];
  return statusPermitidos.includes(status);
};

// Função utilitária para verificar se cliente pode visualizar opções de documento
export const podeGerenciarDocumentos = (status: StatusProcesso, isAdvogado: boolean) => {
  if (isAdvogado) return true; // Advogados sempre podem ver documentos
  // Cliente pode ver opções de documento (mas talvez com restrições)
  const statusPermitidos = [
    StatusProcesso.RASCUNHO,
    StatusProcesso.AGUARDANDO_DADOS,
    StatusProcesso.EM_ANDAMENTO
  ];
  return statusPermitidos.includes(status);
};

// Função utilitária para obter responsável
export const getResponsavel = (processo: ProcessoCliente | ProcessoAdvogado, isAdvogado: boolean) => {
  if (isAdvogado) {
    // Para advogados, mostrar o cliente
    return processo.cliente.nome;
  } else {
    // Para clientes, mostrar o advogado
    if (processo.status === StatusProcesso.RASCUNHO) {
      return "Relacionando com advogado";
    } else if (processo.status === StatusProcesso.EM_ANDAMENTO) {
      return "Em análise...";
    } else {
      return processo.advogado?.nome || 'Advogado não definido';
    }
  }
};

// Função utilitária para converter arquivo para base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};