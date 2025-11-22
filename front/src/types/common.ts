// Tipos para dados comuns do projeto

export interface BibliotecaContent {
  id: number;
  titulo: string;
  categoria: string;
  imagem: string;
  subTitulo: string;
  resumo: string;
  conteudo: string;
  palavrasChave: string[];
  dataPublicacao: string;
  tempoLeitura: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ProfileItem {
  id: string;
  label: string;
  value: string;
  editable: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
}

// Tipos para geração de conteúdo
export interface GenerationConfig {
  temperature: number;
  maxTokens: number;
  model: string;
}

// Tipos para mapeamentos
export type StatusMapping = Record<string, string>;
export type CategoryMapping = Record<string, string>;
export type TypeMapping = Record<string, string>;

// Tipos para dados de cadastro
export interface CadastroData {
  nome: string;
  email: string;
  senha: string;
  tipo: 'advogado' | 'cliente';
  [key: string]: unknown; // Para campos adicionais
}

// Tipos para eventos
export interface EventoData {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: string;
}

// Tipos para jurisprudência
export interface JurisprudenceItem {
  id: string;
  title: string;
  summary: string;
  court: string;
  date: string;
  keywords: string[];
}