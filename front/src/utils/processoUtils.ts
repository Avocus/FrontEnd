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
export const getStatusLabel = (status: string) => {
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
};

// Função utilitária para obter variante do badge de status
export const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    [StatusProcesso.RASCUNHO] : "outline",
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
    [StatusProcesso.RASCUNHO]: "bg-dashboard-yellow-light text-dashboard-yellow border-dashboard-yellow",
    [StatusProcesso.PENDENTE]: "bg-dashboard-gray-light text-dashboard-gray border-dashboard-gray",
    [StatusProcesso.EM_ANALISE]: "bg-dashboard-blue-light text-dashboard-blue border-dashboard-blue",
    [StatusProcesso.ACEITO]: "bg-dashboard-green-light text-dashboard-green border-dashboard-green",
    [StatusProcesso.REJEITADO]: "bg-dashboard-red-light text-dashboard-red border-dashboard-red",
    [StatusProcesso.AGUARDANDO_DADOS]: "bg-dashboard-orange-light text-dashboard-orange border-dashboard-orange",
    [StatusProcesso.DADOS_ENVIADOS]: "bg-dashboard-purple-light text-dashboard-purple border-dashboard-purple",
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: "bg-dashboard-blue-light text-dashboard-blue border-dashboard-blue",
    [StatusProcesso.EM_ANDAMENTO]: "bg-dashboard-emerald-light text-dashboard-emerald border-dashboard-emerald",
    [StatusProcesso.PROTOCOLADO]: "bg-dashboard-blue-light text-dashboard-blue border-dashboard-blue",
    [StatusProcesso.EM_JULGAMENTO]: "bg-dashboard-yellow-light text-dashboard-yellow border-dashboard-yellow",
    [StatusProcesso.CONCLUIDO]: "bg-dashboard-green-light text-dashboard-green border-dashboard-green",
    [StatusProcesso.ARQUIVADO]: "bg-dashboard-gray-light text-dashboard-gray border-dashboard-gray"
  };
  return colors[status] || "bg-dashboard-gray-light text-dashboard-gray border-dashboard-gray";
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