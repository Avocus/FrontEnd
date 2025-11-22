export enum StatusProcesso {
  RASCUNHO = 'Rascunho',
  PENDENTE = 'Pendente',
  EM_ANALISE = 'Em Análise',
  ACEITO = 'Aceito',
  REJEITADO = 'Rejeitado',
  AGUARDANDO_DADOS = 'Aguardando Dados',
  DADOS_ENVIADOS = 'Dados Enviados',
  AGUARDANDO_ANALISE_DADOS = 'Aguardando Análise de Dados',
  EM_ANDAMENTO = 'Em Andamento',
  PROTOCOLADO = 'Protocolado',
  EM_JULGAMENTO = 'Em Julgamento',
  CONCLUIDO = 'Concluído',
  ARQUIVADO = 'Arquivado'
}

export enum TipoProcesso {
  CIVIL = 'Civil',
  PENAL = 'Penal',
  TRABALHISTA = 'Trabalhista',
  ADMINISTRATIVO = 'Administrativo',
  CONSUMIDOR = 'Direito do Consumidor',
  FAMILIAR = 'Direito de Família',
  PREVIDENCIARIO = 'Previdenciário',
  OUTROS = 'OUTROS'
}