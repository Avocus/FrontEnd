export enum StatusProcesso {
  RASCUNHO = 'RASCUNHO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  AGUARDANDO_DOCUMENTOS = 'AGUARDANDO_DOCUMENTOS',
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

export enum StatusCaso {
  PENDENTE = 'pendente',
  EM_ANALISE = 'em_analise',
  ACEITO = 'aceito',
  REJEITADO = 'rejeitado',
  AGUARDANDO_DOCUMENTOS = 'aguardando_documentos',
  DOCUMENTOS_ENVIADOS = 'documentos_enviados',
  AGUARDANDO_ANALISE_DOCUMENTOS = 'aguardando_analise_documentos',
  EM_ANDAMENTO = 'em_andamento',
  PROTOCOLADO = 'protocolado'
}

export enum StatusCasoAdvogado {
  ACEITO = 'aceito',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  ARQUIVADO = 'arquivado',
  ESPERANDO_DOCUMENTOS = 'esperando_documentos',
  AGUARDANDO_ANALISE_DOCUMENTOS = 'aguardando_analise_documentos',
  PROTOCOLADO = 'protocolado'
}