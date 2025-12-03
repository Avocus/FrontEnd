export enum StatusProcesso {
  RASCUNHO = 'RASCUNHO',
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  ACEITO = 'ACEITO',
  REJEITADO = 'REJEITADO',
  AGUARDANDO_DADOS = 'AGUARDANDO_DADOS',
  DADOS_ENVIADOS = 'DADOS_ENVIADOS',
  AGUARDANDO_ANALISE_DADOS = 'AGUARDANDO_ANALISE_DADOS',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PROTOCOLADO = 'PROTOCOLADO',
  EM_JULGAMENTO = 'EM_JULGAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  ARQUIVADO = 'ARQUIVADO'
}

export enum TipoProcesso {
  CIVIL = 'CIVIL',
  PENAL = 'PENAL',
  TRABALHISTA = 'TRABALHISTA',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  CONSUMIDOR = 'CONSUMIDOR',
  FAMILIAR = 'FAMILIAR',
  PREVIDENCIARIO = 'PREVIDENCIARIO',
  OUTROS = 'OUTROS'
}

export enum StatusTicket {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Especialidade {
  DIREITO_CIVIL = 'DIREITO_CIVIL',
  DIREITO_PENAL = 'DIREITO_PENAL',
  DIREITO_TRABALHISTA = 'DIREITO_TRABALHISTA',
  DIREITO_TRIBUTARIO = 'DIREITO_TRIBUTARIO',
  DIREITO_FAMILIAR = 'DIREITO_FAMILIAR',
  DIREITO_CONSUMIDOR = 'DIREITO_CONSUMIDOR',
  DIREITO_AMBIENTAL = 'DIREITO_AMBIENTAL',
  DIREITO_ADMINISTRATIVO = 'DIREITO_ADMINISTRATIVO',
  DIREITO_PREVIDENCIARIO = 'DIREITO_PREVIDENCIARIO',
  DIREITO_IMOBILIARIO = 'DIREITO_IMOBILIARIO'
}

export const getStatusProcessoLabel = (status: StatusProcesso): string => {
  const labels: Record<StatusProcesso, string> = {
    [StatusProcesso.RASCUNHO]: 'Rascunho',
    [StatusProcesso.PENDENTE]: 'Pendente',
    [StatusProcesso.EM_ANALISE]: 'Em Análise',
    [StatusProcesso.ACEITO]: 'Aceito',
    [StatusProcesso.REJEITADO]: 'Rejeitado',
    [StatusProcesso.AGUARDANDO_DADOS]: 'Aguardando Documentos',
    [StatusProcesso.DADOS_ENVIADOS]: 'Documentos Enviados',
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: 'Aguardando Análise de Documentos',
    [StatusProcesso.EM_ANDAMENTO]: 'Em Andamento',
    [StatusProcesso.PROTOCOLADO]: 'Protocolado',
    [StatusProcesso.EM_JULGAMENTO]: 'Em Julgamento',
    [StatusProcesso.CONCLUIDO]: 'Concluído',
    [StatusProcesso.ARQUIVADO]: 'Arquivado'
  }
  return labels[status] || status
}

export const getTipoProcessoLabel = (tipo: TipoProcesso): string => {
  const labels: Record<TipoProcesso, string> = {
    [TipoProcesso.CIVIL]: "Civil",
    [TipoProcesso.PENAL]: "Penal",
    [TipoProcesso.TRABALHISTA]: "Trabalhista",
    [TipoProcesso.ADMINISTRATIVO]: "Administrativo",
    [TipoProcesso.CONSUMIDOR]: "Direito do Consumidor",
    [TipoProcesso.FAMILIAR]: "Direito de Família",
    [TipoProcesso.PREVIDENCIARIO]: "Previdenciário",
    [TipoProcesso.OUTROS]: "Outros"
  }
  return labels[tipo] || tipo
}

export const getEspecialidadeLabel = (especialidade: Especialidade): string => {
  const labels: Record<Especialidade, string> = {
    [Especialidade.DIREITO_CIVIL]: "Direito Civil",
    [Especialidade.DIREITO_PENAL]: "Direito Penal",
    [Especialidade.DIREITO_TRABALHISTA]: "Direito Trabalhista",
    [Especialidade.DIREITO_TRIBUTARIO]: "Direito Tributário",
    [Especialidade.DIREITO_FAMILIAR]: "Direito de Família",
    [Especialidade.DIREITO_CONSUMIDOR]: "Direito do Consumidor",
    [Especialidade.DIREITO_AMBIENTAL]: "Direito Ambiental",
    [Especialidade.DIREITO_ADMINISTRATIVO]: "Direito Administrativo",
    [Especialidade.DIREITO_PREVIDENCIARIO]: "Direito Previdenciário",
    [Especialidade.DIREITO_IMOBILIARIO]: "Direito Imobiliário"
  }
  return labels[especialidade] || especialidade
}

export const getStatusTicketLabel = (status: string): string => {
  const labels: Record<string, string> = {
    [StatusTicket.PENDING]: 'Pendente',
    [StatusTicket.ASSIGNED]: 'Atribuído',
    [StatusTicket.COMPLETED]: 'Concluído',
    [StatusTicket.CANCELLED]: 'Cancelado'
  }
  return labels[status] || status
}

export const getStatusUrgenciaLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'BAIXA': 'Baixa',
    'MEDIA': 'Média',
    'ALTA': 'Alta'
  }
  return labels[status] || status
}