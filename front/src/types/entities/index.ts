// Arquivo de barril (barrel) para exportar todas as entidades

export * from './Advogado';
export * from './Avaliacao';
// Cliente.ts é importado diretamente para evitar ambiguidade com ClienteProfile
// export * from './Cliente';
export * from './Caso';
export * from './Documento';
export * from './Endereco';
export * from './Evento';
export * from './Mensagem';
export * from './Notificacao';
export * from './Prazo';
export type { Processo, ProcessoDTO, ClienteDTO, AdvogadoDTO, StatusUpdateDTO, ProcessoCliente, TimelineEntry, ProcessoStatus } from './Processo';
export * from './Profile';
export * from './Role';
export * from './User';
export * from './DadoRequisitado'; 