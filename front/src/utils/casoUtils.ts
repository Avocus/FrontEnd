import { CasoCliente, CasoAdvogado, TimelineEntry } from "@/types/entities";
import { StatusProcesso } from "@/types/enums";

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

// Função utilitária para adicionar entrada no timeline
export const addTimelineEntry = (
  statusAnterior: string | undefined,
  novoStatus: string,
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
export const getResponsavel = (caso: CasoCliente | CasoAdvogado, isAdvogado: boolean) => {
  if (isAdvogado) {
    // Para advogados, mostrar o cliente
    return caso.cliente.nome;
  } else {
    // Para clientes, mostrar o advogado
    if (caso.status === StatusProcesso.RASCUNHO) {
      return "Relacionando com advogado";
    } else if (caso.status === StatusProcesso.EM_ANDAMENTO) {
      return "Em análise...";
    } else {
      return caso.advogado?.nome || 'Advogado não definido';
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