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

export const getStatusProcessoLabel = (status: StatusProcesso): string => {
  const labels: Record<StatusProcesso, string> = {
    [StatusProcesso.RASCUNHO]: 'Rascunho',
    [StatusProcesso.PENDENTE]: 'Pendente',
    [StatusProcesso.EM_ANALISE]: 'Em Análise',
    [StatusProcesso.ACEITO]: 'Aceito',
    [StatusProcesso.REJEITADO]: 'Rejeitado',
    [StatusProcesso.AGUARDANDO_DADOS]: 'Aguardando Dados',
    [StatusProcesso.DADOS_ENVIADOS]: 'Dados Enviados',
    [StatusProcesso.AGUARDANDO_ANALISE_DADOS]: 'Aguardando Análise de Dados',
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